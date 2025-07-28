
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { getProductsClient, updateProductsClient } from '@/lib/products-client';
import { getSlidesClient, updateSlidesClient } from '@/lib/slides-client';
import { getBentoClient, updateBentoClient } from '@/lib/bento-client';
import { getCollectionsClient, updateCollectionsClient } from '@/lib/collections-client';
import { getInfoFeaturesClient, updateInfoFeaturesClient } from '@/lib/info-features-client';
import { getMarqueeClient, updateMarqueeClient } from '@/lib/marquee-client';
import { getProductCategoriesClient } from '@/lib/products-client';
import { updateOrderClient, deleteOrderClient } from '@/lib/orders-client';
import { type Product, type ProductReview } from '@/lib/products';
import { type Slide } from '@/lib/slides';
import { type Bento } from '@/lib/bento';
import { type Collection } from '@/lib/collections';
import { type InfoFeature } from '@/lib/info-features';
import { type Marquee } from '@/lib/marquee';
import { type Order } from '@/lib/orders';
import { type Message } from '@/app/api/contact/route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, Package, RefreshCw, Shirt, Headphones, Home, Star, Edit, MessageSquare, Mail, Sparkles, ToyBrick, Car, Gamepad2, Heart, ImageIcon, LayoutGrid, Layers, ScrollText, Phone, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/admin/image-upload';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'success' | 'error';
type ActiveTab = 'products' | 'orders' | 'slides' | 'bento' | 'collections' | 'features' | 'marquee' | 'messages';

async function getMessagesClient(): Promise<Message[]> {
    try {
        const res = await fetch(`/api/messages/get?v=${new Date().getTime()}`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}
async function updateMessagesClient(messages: Message[]): Promise<void> {
  await fetch('/api/messages/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  });
}

// New function to fetch orders from a dedicated API route
async function fetchOrdersFromApi(): Promise<Order[]> {
    const res = await fetch('/api/orders/get', { cache: 'no-store' });
    if (!res.ok) {
        console.error("Failed to fetch orders");
        return [];
    }
    return await res.json();
}

const emptyReview: ProductReview = { id: 0, author: '', rating: 5, comment: '', date: '' };

// Composant pour afficher un indicateur de chargement
const LoadingState = ({ message = 'Chargement...' }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <Loader2 className="h-8 w-8 animate-spin mb-4" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

// Composant pour afficher un message d'erreur
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md">
    <p className="text-destructive mb-4">{message}</p>
    <Button variant="outline" size="sm" onClick={onRetry}>
      <RefreshCw className="h-4 w-4 mr-2" />
      Réessayer
    </Button>
  </div>
);

// Composant pour le bouton d'enregistrement
const SaveButton = ({ status, onSave }: { status: SaveStatus; onSave: () => void }) => (
  <Button 
    onClick={onSave}
    disabled={status === 'saving' || status === 'idle'}
    className="min-w-[120px]"
  >
    {status === 'saving' ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Enregistrement...
      </>
    ) : (
      'Enregistrer les modifications'
    )}
  </Button>
);

// Composant pour les champs de formulaire avec label
const FormField = ({ 
  label, 
  children, 
  className = '' 
}: { 
  label: string; 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={cn('grid gap-2', className)}>
    <Label className="text-sm font-medium">{label}</Label>
    <div dir="rtl" className="[&>*]:w-full">
      {children}
    </div>
  </div>
);

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  // États principaux
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Données
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [bentoItems, setBentoItems] = useState<Bento[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [infoFeatures, setInfoFeatures] = useState<InfoFeature[]>([]);
  const [marquee, setMarquee] = useState<Marquee>({ messages: [] });
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [bentoItemToDelete, setBentoItemToDelete] = useState<Bento | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);
  const [infoFeatureToDelete, setInfoFeatureToDelete] = useState<InfoFeature | null>(null);

  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Package' });
  const [editingReview, setEditingReview] = useState<{ product: Product, review: ProductReview } | null>(null);
  
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const lastOrderCountRef = useRef<number>(0);

  const fetchCategories = useCallback(async () => {
    const cats = await getProductCategoriesClient();
    setProductCategories(cats);
  }, []);

  const fetchOrders = useCallback(async (isInitialLoad = false) => {
    try {
        const ords = await fetchOrdersFromApi();
        setOrders(ords);

        if (isInitialLoad) {
          lastOrderCountRef.current = ords.length;
        } else if (ords.length > lastOrderCountRef.current && ords.length > 0) {
            toast({
                title: "Nouvelle commande !",
                description: `Vous avez reçu ${ords.length - lastOrderCountRef.current} nouvelle(s) commande(s).`,
            });
            notificationSoundRef.current?.play().catch(e => console.error("Error playing sound:", e));
        }
        lastOrderCountRef.current = ords.length;
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast({ title: "Erreur", description: "Impossible de charger les commandes.", variant: "destructive" });
    }
  }, [toast]);
  
  const fetchMessages = useCallback(async () => {
    try {
        const msgs = await getMessagesClient();
        setMessages(msgs);
    } catch (error) {
        console.error("Failed to fetch messages:", error);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.email !== 'grasdvirus@gmail.com') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.email === 'grasdvirus@gmail.com') {
        if (typeof Audio !== "undefined") {
            notificationSoundRef.current = new Audio('/sons/notif.wav');
        }

        async function loadData() {
            setLoading(true);
            try {
                const [prods, slds, bento, colls, info, marq, cats, ords, msgs] = await Promise.all([
                    getProductsClient(), 
                    getSlidesClient(),
                    getBentoClient(),
                    getCollectionsClient(),
                    getInfoFeaturesClient(),
                    getMarqueeClient(),
                    getProductCategoriesClient(),
                    fetchOrdersFromApi(),
                    getMessagesClient()
                ]);
                setProducts(prods.map(p => ({ ...p, images: p.images.length > 0 ? p.images : ['', ''], likes: p.likes || 0 })));
                setSlides(slds);
                setBentoItems(bento);
                setCollections(colls);
                setInfoFeatures(info);
                setMarquee(marq);
                setProductCategories(cats);
                setOrders(ords);
                setMessages(msgs);
                lastOrderCountRef.current = ords.length;
                setSaveStatus('idle');
            } catch (error) {
                console.error("Failed to load admin data:", error);
                toast({ title: "Erreur", description: "Impossible de charger les données de l'administration.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }
        loadData();

        const intervalId = setInterval(() => {
          fetchOrders(false);
          fetchMessages();
        }, 30000); 
        return () => clearInterval(intervalId);
    }
  }, [user, fetchOrders, toast, fetchMessages]);

  const markAsDirty = () => {
    if (saveStatus === 'idle' || saveStatus === 'success') {
      setSaveStatus('dirty');
    }
  }

  const handleInputChange = useCallback(<T extends { id: any }>(
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    id: any,
    field: keyof T,
    value: any
  ) => {
    setState(prevState =>
      prevState.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    markAsDirty();
  }, []);
  
  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    const originalOrders = orders;
    const updatedOrders = originalOrders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);

    const orderToUpdate = updatedOrders.find(o => o.id === orderId);

    if (orderToUpdate) {
        try {
            await updateOrderClient(orderToUpdate);
            toast({
                title: "Statut mis à jour",
                description: `Le statut de la commande a été changé en "${status}".`,
            });
        } catch (error) {
            setOrders(originalOrders);
            toast({
                title: "Erreur de mise à jour",
                description: "Le statut de la commande n'a pas pu être mis à jour.",
                variant: "destructive",
            });
        }
    }
  };
  
  const handleMessageStatusChange = async (messageId: string, read: boolean) => {
    const updatedMessages = messages.map(msg => msg.id === messageId ? { ...msg, read } : msg);
    setMessages(updatedMessages);
    await updateMessagesClient(updatedMessages);
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(updatedMessages);
    await updateMessagesClient(updatedMessages);
    toast({ title: "Message supprimé" });
  };

  const handleProductImageChange = useCallback((productId: number, imageIndex: number, url: string) => {
    setProducts(prevProducts =>
        prevProducts.map(p => {
            if (p.id === productId) {
                const newImages = [...p.images];
                newImages[imageIndex] = url;
                return { ...p, images: newImages };
            }
            return p;
        })
    );
    markAsDirty();
  }, []);

  const handleProductFeatureChange = useCallback((productId: number, featureIndex: number, value: string) => {
     setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const newFeatures = [...p.features];
          newFeatures[featureIndex] = value;
          return { ...p, features: newFeatures };
        }
        return p;
      })
    );
    markAsDirty();
  }, []);

  const handleMarqueeChange = useCallback((index: number, value: string) => {
    setMarquee(prev => {
        const newMessages = [...prev.messages];
        newMessages[index] = value;
        return { ...prev, messages: newMessages };
    });
    markAsDirty();
  }, []);

  const handleAddProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: newId,
      name: 'Nouveau Produit',
      description: '',
      price: 0,
      category: productCategories[0] || '',
      rating: 0,
      stock: 0,
      reviews: [],
      images: ['', ''],
      features: ['', '', ''],
      data_ai_hint: '',
      likes: 0,
    };
    setProducts(prev => [newProduct, ...prev]);
    markAsDirty();
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      markAsDirty();
      setProductToDelete(null);
      toast({
        title: "Produit supprimé",
        description: `Le produit "${productToDelete.name}" a été supprimé.`,
      });
    }
  };

  const handleDeleteBentoItem = (item: Bento) => {
    setBentoItemToDelete(item);
  };
  
  const confirmDeleteBentoItem = () => {
    if (bentoItemToDelete) {
      setBentoItems(prev => prev.filter(item => item.id !== bentoItemToDelete.id));
      markAsDirty();
      setBentoItemToDelete(null);
      toast({
        title: "Élément Bento supprimé",
        description: `L'élément "${bentoItemToDelete.title}" a été supprimé.`,
      });
    }
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
  };
  
  const confirmDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        await deleteOrderClient(orderToDelete.id);
        setOrders(prev => prev.filter(order => order.id !== orderToDelete.id));
        toast({
          title: "Commande supprimée",
          description: `La commande de ${orderToDelete.customer.name} a été supprimée avec succès.`,
        });
      } catch (error) {
        toast({
          title: "Erreur de suppression",
          description: "La commande n'a pas pu être supprimée.",
          variant: "destructive",
        });
      } finally {
        setOrderToDelete(null);
      }
    }
  };


  const handleAddCategory = () => {
    if (newCategory.name && !productCategories.includes(newCategory.name)) {
        const updatedCategories = [...productCategories, newCategory.name];
        setProductCategories(updatedCategories);
        
        const newCollection: Collection = {
            id: collections.length > 0 ? Math.max(...collections.map(c => c.id)) + 1 : 1,
            name: newCategory.name,
            href: `/collections/${newCategory.name}`,
            image: "https://placehold.co/400x500.png",
            data_ai_hint: "fashion"
        }
        setCollections(prev => [...prev, newCollection]);

        setNewCategory({ name: '', icon: 'Package' });
        setIsAddCategoryDialogOpen(false);
        toast({
            title: "Catégorie ajoutée",
            description: `La catégorie "${newCategory.name}" a été ajoutée. N'oubliez pas de sauvegarder.`,
        });
        markAsDirty();
    } else {
        toast({
            title: "Erreur",
            description: "Le nom de la catégorie ne peut pas être vide ou exister déjà.",
            variant: "destructive"
        });
    }
  };

  const handleAddBentoItem = () => {
    const newId = bentoItems.length > 0 ? Math.max(...bentoItems.map(p => p.id)) + 1 : 1;
    const newBentoItem: Bento = {
        id: newId,
        title: "Nouveau titre",
        subtitle: "Nouveau sous-titre",
        imageUrl: "https://placehold.co/600x400.png",
        href: "/collections/Vêtements",
        className: "md:col-span-1",
        data_ai_hint: "item"
    };
    setBentoItems(prev => [newBentoItem, ...prev]);
    markAsDirty();
  };

  const handleSaveReview = () => {
    if (!editingReview) return;
    const { product, review } = editingReview;
    const updatedReview = { ...review, date: review.date || new Date().toISOString() };

    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === product.id) {
          const existingReviews = p.reviews || [];
          const isExisting = existingReviews.some(r => r.id === updatedReview.id);
          const newReviews = isExisting
            ? existingReviews.map(r => r.id === updatedReview.id ? updatedReview : r)
            : [...existingReviews, { ...updatedReview, id: Date.now() }];
          return { ...p, reviews: newReviews };
        }
        return p;
      })
    );
    markAsDirty();
    setEditingReview(null);
    toast({ title: "Avis enregistré" });
  };
  
  const handleDeleteReview = (productId: number, reviewId: number) => {
    setProducts(prevProducts =>
        prevProducts.map(p => {
            if (p.id === productId) {
                return { ...p, reviews: (p.reviews || []).filter(r => r.id !== reviewId) };
            }
            return p;
        })
    );
    markAsDirty();
    toast({ title: "Avis supprimé" });
  };


  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    try {
      const productsToSave = products.map(p => ({
        ...p,
        images: p.images.filter(img => img && img.trim() !== '')
      }));

      await Promise.all([
          updateProductsClient(productsToSave),
          updateSlidesClient(slides),
          updateBentoClient(bentoItems),
          updateCollectionsClient(collections),
          updateInfoFeaturesClient(infoFeatures),
          updateMarqueeClient(marquee),
      ]);
      await fetchCategories();
      await fetchOrders(true);
      await fetchMessages();
      toast({
        title: 'Succès',
        description: 'Les données ont été mises à jour.',
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save data:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les modifications.',
        variant: 'destructive',
      });
      setSaveStatus('dirty'); 
    }
  };

    const handleAddSlide = () => {
        const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1;
        const newSlide: Slide = {
            id: newId,
            title: 'Nouveau Titre',
            description: 'Nouvelle description',
            imageUrl: 'https://placehold.co/1920x1080.png',
            data_ai_hint: 'background'
        };
        setSlides(prev => [newSlide, ...prev]);
        markAsDirty();
    };

    const handleDeleteSlide = (slide: Slide) => {
        setSlideToDelete(slide);
    };

    const confirmDeleteSlide = () => {
        if (slideToDelete) {
            setSlides(prev => prev.filter(s => s.id !== slideToDelete.id));
            markAsDirty();
            setSlideToDelete(null);
            toast({
                title: "Diapositive supprimée",
                description: `La diapositive "${slideToDelete.title}" a été supprimée.`,
            });
        }
    };

    const handleAddInfoFeature = () => {
        const newId = infoFeatures.length > 0 ? Math.max(...infoFeatures.map(i => i.id)) + 1 : 1;
        const newFeature: InfoFeature = {
            id: newId,
            iconName: 'Lock',
            title: 'Nouveau Titre',
            description: 'Nouvelle description'
        };
        setInfoFeatures(prev => [...prev, newFeature]);
        markAsDirty();
    };

    const handleDeleteInfoFeature = (feature: InfoFeature) => {
        setInfoFeatureToDelete(feature);
    };

    const confirmDeleteInfoFeature = () => {
        if (infoFeatureToDelete) {
            setInfoFeatures(prev => prev.filter(i => i.id !== infoFeatureToDelete.id));
            markAsDirty();
            setInfoFeatureToDelete(null);
            toast({
                title: "Élément d'info supprimé",
                description: `L'élément "${infoFeatureToDelete.title}" a été supprimé.`,
            });
        }
    };
    
    const handleAddMarqueeMessage = () => {
        setMarquee(prev => ({ ...prev, messages: [...prev.messages, 'Nouveau message'] }));
        markAsDirty();
    };

    const handleDeleteMarqueeMessage = (index: number) => {
        setMarquee(prev => ({
            ...prev,
            messages: prev.messages.filter((_, i) => i !== index)
        }));
        markAsDirty();
    };
  
  if (authLoading || loading) {
    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    );
  }

  if (user?.email !== 'grasdvirus@gmail.com') {
    return <p className="text-center py-10">Vous n'avez pas l'autorisation d'accéder à cette page.</p>;
  }

  const SaveButtonContent = () => {
    switch (saveStatus) {
        case 'saving':
            return <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>;
        case 'dirty':
            return <>
                <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
                Enregistrer les modifications
            </>;
        case 'success':
            return <>
                <span className="relative flex h-3 w-3 mr-2">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Enregistré !
            </>;
        default:
            return 'Enregistrer les modifications';
    }
  };

  const CategorySelector = ({ value, onChange }: { value: string, onChange: (value: any) => void }) => (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
            <SelectValue placeholder="Choisir une catégorie" />
        </SelectTrigger>
        <SelectContent>
            {productCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
        </SelectContent>
    </Select>
  );

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as ActiveTab)} 
        className="space-y-4"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produits
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Shirt className="h-4 w-4" />
            Commandes
          </TabsTrigger>
          <TabsTrigger value="slides" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Diapositives
          </TabsTrigger>
          <TabsTrigger value="bento" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Bento Grid
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Collections
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Fonctionnalités
          </TabsTrigger>
          <TabsTrigger value="marquee" className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            Bandeau
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
            {unreadMessagesCount > 0 && <Badge className="ml-2">{unreadMessagesCount}</Badge>}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestion des Commandes</CardTitle>
              <Button onClick={() => fetchOrders(true)} variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map(order => (
                  <Collapsible key={order.id} className="border rounded-lg p-4">
                    <CollapsibleTrigger className="w-full flex justify-between items-center text-left">
                      <div>
                        <p className="font-bold">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
                      </div>
                      <div className='text-right'>
                        <Badge variant={order.status === 'confirmed' ? 'default' : order.status === 'shipped' ? 'secondary' : 'destructive'}>{order.status}</Badge>
                        <p className="font-bold">{order.total.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 mt-4 border-t">
                      <div className='grid md:grid-cols-2 gap-4'>
                        <div>
                          <h4 className='font-semibold mb-2'>Client</h4>
                          <p><strong>Nom:</strong> {order.customer.name}</p>
                          <p><strong>Téléphone:</strong> {order.customer.phone}</p>
                          <p><strong>Email:</strong> {order.customer.email || 'N/A'}</p>
                          <p><strong>Adresse:</strong> {order.customer.address}</p>
                           {order.customer.notes && <p><strong>Notes:</strong> {order.customer.notes}</p>}
                        </div>
                        <div>
                          <h4 className='font-semibold mb-2'>Produits</h4>
                          <ul className='list-disc pl-5'>
                            {order.items.map(item => (
                              <li key={item.id}>{item.quantity} x {item.name}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className='mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between'>
                         <div>
                            <h4 className='font-semibold mb-2'>Changer le statut</h4>
                            <Select value={order.status} onValueChange={(value: Order['status']) => handleOrderStatusChange(order.id, value)}>
                                <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="confirmed">Confirmée</SelectItem>
                                <SelectItem value="shipped">Expédiée</SelectItem>
                                <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <Button variant="destructive" onClick={() => handleDeleteOrder(order)}>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Supprimer la commande
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion des Messages</CardTitle>
                    <Button onClick={fetchMessages} variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <Collapsible key={msg.id} className="border rounded-lg p-4" data-state={msg.read ? 'closed' : 'open'}>
                                <CollapsibleTrigger className="w-full flex justify-between items-center text-left gap-4">
                                    <div className="flex items-center gap-3">
                                       <div
                                            role="button"
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7"
                                            onClick={(e) => { e.stopPropagation(); handleMessageStatusChange(msg.id, !msg.read); }}
                                        >
                                            {msg.read ? <Mail className="text-muted-foreground" /> : <Mail className="text-primary" />}
                                            <span className="sr-only">Marquer comme lu/non lu</span>
                                        </div>
                                        <div>
                                            <p className="font-bold">{msg.name}</p>
                                            <p className="text-sm text-muted-foreground">{format(new Date(msg.createdAt), "'le' dd/MM/yyyy 'à' HH:mm", { locale: fr })}</p>
                                        </div>
                                    </div>
                                    <Badge variant={msg.read ? "secondary" : "default"}>{msg.read ? "Lu" : "Non lu"}</Badge>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pt-4 mt-4 border-t">
                                    <p><strong>Email:</strong> {msg.email}</p>
                                    <p className="mt-2 whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{msg.message}</p>
                                    <div className="mt-4 flex justify-end">
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteMessage(msg.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                        </Button>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="products">
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <CardTitle>Gestion des Produits</CardTitle>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nouvelle Catégorie
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
                              <DialogDescription>Cette catégorie sera disponible pour tous les produits et collections.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div>
                                    <Label htmlFor="new-category-name">Nom de la catégorie</Label>
                                    <Input id="new-category-name" value={newCategory.name} onChange={(e) => setNewCategory(c => ({...c, name: e.target.value}))} />
                                </div>
                                <div>
                                    <Label>Icône</Label>
                                    <Select value={newCategory.icon} onValueChange={(v) => setNewCategory(c => ({...c, icon: v}))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Package"><Package className="inline-block mr-2 h-4 w-4" />Général</SelectItem>
                                            <SelectItem value="Shirt"><Shirt className="inline-block mr-2 h-4 w-4" />Vêtements</SelectItem>
                                            <SelectItem value="Headphones"><Headphones className="inline-block mr-2 h-4 w-4" />Accessoires</SelectItem>
                                            <SelectItem value="Home"><Home className="inline-block mr-2 h-4 w-4" />Maison</SelectItem>
                                            <SelectItem value="Sparkles"><Sparkles className="inline-block mr-2 h-4 w-4" />Bijoux</SelectItem>
                                            <SelectItem value="ToyBrick"><ToyBrick className="inline-block mr-2 h-4 w-4" />Jouets</SelectItem>
                                            <SelectItem value="Car"><Car className="inline-block mr-2 h-4 w-4" />Véhicules</SelectItem>
                                            <SelectItem value="Gamepad2"><Gamepad2 className="inline-block mr-2 h-4 w-4" />Jeux</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleAddCategory}>Ajouter la catégorie</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={handleAddProduct} variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Ajouter un produit
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="hidden md:block">
                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Image 1</TableHead>
                                <TableHead className="w-[250px]">Image 2</TableHead>
                                <TableHead className="min-w-[150px]">Nom</TableHead>
                                <TableHead className="min-w-[250px]">Description</TableHead>
                                <TableHead className="min-w-[200px]">Détails</TableHead>
                                <TableHead className="min-w-[250px]">Caractéristiques</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell><ImageUpload value={product.images[0] || ''} onChange={(url) => handleProductImageChange(product.id, 0, url)} /></TableCell>
                                <TableCell><ImageUpload value={product.images[1] || ''} onChange={(url) => handleProductImageChange(product.id, 1, url)} /></TableCell>
                                <TableCell><Input value={product.name} onChange={e => handleInputChange(setProducts, product.id, 'name', e.target.value)} /></TableCell>
                                <TableCell><Textarea value={product.description} onChange={e => handleInputChange(setProducts, product.id, 'description', e.target.value)} /></TableCell>
                                <TableCell className="space-y-2">
                                    <Input type="number" placeholder="Prix" value={product.price} onChange={e => handleInputChange(setProducts, product.id, 'price', Number(e.target.value))} />
                                    <Input type="number" placeholder="Stock" value={product.stock} onChange={e => handleInputChange(setProducts, product.id, 'stock', Number(e.target.value))} />
                                    <CategorySelector value={product.category} onChange={value => handleInputChange(setProducts, product.id, 'category', value)} />
                                    <div className="flex items-center gap-2 pt-2">
                                        <Heart className="h-4 w-4 text-destructive" />
                                        <Input type="number" placeholder="Likes" value={product.likes} onChange={e => handleInputChange(setProducts, product.id, 'likes', Number(e.target.value))} />
                                    </div>
                                </TableCell>
                                <TableCell><div className="space-y-2">{product.features.map((feature, fIndex) => (<Input key={fIndex} value={feature} placeholder={`Caractéristique ${fIndex + 1}`} onChange={e => handleProductFeatureChange(product.id, fIndex, e.target.value)} />))}</div></TableCell>
                                <TableCell>
                                    <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(product)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    <div className="md:hidden space-y-4">
                        {products.map(product => (
                            <Card key={product.id}>
                                <CardHeader>
                                    <Input className="text-lg font-bold" value={product.name} onChange={e => handleInputChange(setProducts, product.id, 'name', e.target.value)} />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <ImageUpload value={product.images[0] || ''} onChange={(url) => handleProductImageChange(product.id, 0, url)} />
                                        <ImageUpload value={product.images[1] || ''} onChange={(url) => handleProductImageChange(product.id, 1, url)} />
                                     </div>
                                     <div>
                                        <Label>Description</Label>
                                        <Textarea value={product.description} onChange={e => handleInputChange(setProducts, product.id, 'description', e.target.value)} />
                                     </div>
                                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div><Label>Prix</Label><Input type="number" placeholder="Prix" value={product.price} onChange={e => handleInputChange(setProducts, product.id, 'price', Number(e.target.value))} /></div>
                                        <div><Label>Stock</Label><Input type="number" placeholder="Stock" value={product.stock} onChange={e => handleInputChange(setProducts, product.id, 'stock', Number(e.target.value))} /></div>
                                        <div><Label>Catégorie</Label><CategorySelector value={product.category} onChange={value => handleInputChange(setProducts, product.id, 'category', value)} /></div>
                                     </div>
                                      <div>
                                        <Label>Likes</Label>
                                        <div className="flex items-center gap-2">
                                            <Heart className="h-4 w-4 text-destructive" />
                                            <Input type="number" placeholder="Likes" value={product.likes} onChange={e => handleInputChange(setProducts, product.id, 'likes', Number(e.target.value))} />
                                        </div>
                                     </div>
                                      <div>
                                        <Label>Caractéristiques</Label>
                                        <div className="space-y-2">{product.features.map((feature, fIndex) => (<Input key={fIndex} value={feature} placeholder={`Caractéristique ${fIndex + 1}`} onChange={e => handleProductFeatureChange(product.id, fIndex, e.target.value)} />))}</div>
                                     </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="destructive" className="w-full" onClick={() => handleDeleteProduct(product)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer le produit
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
            <Card>
                <CardHeader><CardTitle>Gestion des Avis</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    {products.map(product => (
                        <Card key={product.id}>
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setEditingReview({ product, review: { ...emptyReview, id: Date.now() } })}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un avis
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {(product.reviews && product.reviews.length > 0) ? (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Auteur</TableHead><TableHead>Note</TableHead><TableHead>Commentaire</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {product.reviews.map(review => (
                                            <TableRow key={review.id}>
                                                <TableCell>{review.author}</TableCell>
                                                <TableCell><div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}/>)}</div></TableCell>
                                                <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                                                <TableCell>{review.date ? format(new Date(review.date), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingReview({ product, review })}><Edit className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteReview(product.id, review.id)}><Trash2 className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                ) : <p className="text-sm text-muted-foreground">Aucun avis pour ce produit.</p>}
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="slides">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion du Diaporama</CardTitle>
                    <Button onClick={handleAddSlide} variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une diapositive
                    </Button>
                </CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader><TableRow><TableHead className="w-[350px]">Image</TableHead><TableHead>Titre</TableHead><TableHead>Description</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {slides.map((slide) => (
                            <TableRow key={slide.id}>
                                <TableCell><ImageUpload value={slide.imageUrl} onChange={(url) => handleInputChange(setSlides, slide.id, 'imageUrl', url)}/></TableCell>
                                <TableCell><Input value={slide.title} onChange={e => handleInputChange(setSlides, slide.id, 'title', e.target.value)} /></TableCell>
                                <TableCell><Textarea value={slide.description} onChange={e => handleInputChange(setSlides, slide.id, 'description', e.target.value)} /></TableCell>
                                <TableCell>
                                    <Button variant="destructive" size="icon" onClick={() => handleDeleteSlide(slide)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="bento">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion de la Grille Bento</CardTitle>
                    <Button onClick={handleAddBentoItem} variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un élément
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {bentoItems.map(item => (
                        <Card key={item.id} className="p-4">
                             <div className="flex justify-between items-start">
                                <h3 className="font-semibold mb-2">Élément {item.id}</h3>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteBentoItem(item)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                   <Label>Titre</Label>
                                   <Input value={item.title} onChange={e => handleInputChange(setBentoItems, item.id, 'title', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                   <Label>Sous-titre / Description</Label>
                                   <Input value={item.subtitle} onChange={e => handleInputChange(setBentoItems, item.id, 'subtitle', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                   <Label>Lien (interne ou externe)</Label>
                                   <Input value={item.href} onChange={e => handleInputChange(setBentoItems, item.id, 'href', e.target.value)} placeholder="/collections/Vêtements ou https://..."/>
                                </div>
                                <div className="space-y-2">
                                   <Label>Image</Label>
                                   <ImageUpload value={item.imageUrl} onChange={url => handleInputChange(setBentoItems, item.id, 'imageUrl', url)} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="collections">
            <Card>
                <CardHeader><CardTitle>Gestion des Collections</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Lien vers la catégorie</TableHead><TableHead className="w-[350px]">Image</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {collections.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell><Input value={item.name} onChange={e => handleInputChange(setCollections, item.id, 'name', e.target.value)} /></TableCell>
                                        <TableCell>
                                            <CategorySelector 
                                                value={item.href.startsWith('/collections/') ? item.href.replace('/collections/', '') : ''} 
                                                onChange={value => handleInputChange(setCollections, item.id, 'href', `/collections/${value}`)} 
                                            />
                                        </TableCell>
                                        <TableCell><ImageUpload value={item.image} onChange={url => handleInputChange(setCollections, item.id, 'image', url)}/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="features">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion de la Section Info</CardTitle>
                    <Button onClick={handleAddInfoFeature} variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un élément
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {infoFeatures.map(item => (
                         <Card key={item.id} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">Élément {item.id}</h3>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteInfoFeature(item)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                             <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Icône</Label>
                                    <Select value={item.iconName} onValueChange={(value: 'Lock' | 'Heart' | 'Phone') => handleInputChange(setInfoFeatures, item.id, 'iconName', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Lock"><Lock className="inline-block mr-2 h-4 w-4" />Paiement Sécurisé</SelectItem>
                                            <SelectItem value="Heart"><Heart className="inline-block mr-2 h-4 w-4" />Fait avec Amour</SelectItem>
                                            <SelectItem value="Phone"><Phone className="inline-block mr-2 h-4 w-4" />Support Client</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Titre</Label>
                                    <Input value={item.title} onChange={e => handleInputChange(setInfoFeatures, item.id, 'title', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={item.description} onChange={e => handleInputChange(setInfoFeatures, item.id, 'description', e.target.value)} rows={4}/>
                                </div>
                             </div>
                         </Card>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="marquee">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion du Bandeau Défilant</CardTitle>
                    <Button onClick={handleAddMarqueeMessage} variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un message
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {marquee.messages.map((message, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input 
                                value={message}
                                onChange={e => handleMarqueeChange(index, e.target.value)}
                                className="flex-grow"
                            />
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteMarqueeMessage(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action est irréversible. Le produit "{productToDelete?.name}" sera définitivement supprimé.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDelete(null)}>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteProduct}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!bentoItemToDelete} onOpenChange={(open) => !open && setBentoItemToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action est irréversible. L'élément "{bentoItemToDelete?.title}" sera définitivement supprimé.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setBentoItemToDelete(null)}>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteBentoItem}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action est irréversible. La commande de "{orderToDelete?.customer.name}" sera définitivement supprimée.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOrderToDelete(null)}>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteOrder}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={!!slideToDelete} onOpenChange={(open) => !open && setSlideToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action est irréversible. La diapositive "{slideToDelete?.title}" sera définitivement supprimée.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSlideToDelete(null)}>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteSlide}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!infoFeatureToDelete} onOpenChange={(open) => !open && setInfoFeatureToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action est irréversible. L'élément d'info "{infoFeatureToDelete?.title}" sera définitivement supprimé.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setInfoFeatureToDelete(null)}>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteInfoFeature}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <Dialog open={!!editingReview} onOpenChange={(open) => !open && setEditingReview(null)}>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Modifier l'avis</DialogTitle>
                <DialogDescription>
                    Modification de l'avis pour le produit : {editingReview?.product.name}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="review-author">Auteur</Label>
                    <Input id="review-author" value={editingReview?.review.author || ''} onChange={(e) => setEditingReview(r => r ? { ...r, review: { ...r.review, author: e.target.value } } : null)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="review-rating">Note</Label>
                    <Select value={editingReview?.review.rating.toString() || '5'} onValueChange={(val) => setEditingReview(r => r ? { ...r, review: { ...r.review, rating: Number(val) } } : null)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()}>{n} étoile{n > 1 ? 's' : ''}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="review-comment">Commentaire</Label>
                    <Textarea id="review-comment" value={editingReview?.review.comment || ''} onChange={(e) => setEditingReview(r => r ? { ...r, review: { ...r.review, comment: e.target.value } } : null)} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setEditingReview(null)}>Annuler</Button>
                <Button onClick={handleSaveReview}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
       </Dialog>

        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 flex justify-center z-40">
            <Button onClick={handleSaveChanges} disabled={saveStatus === 'saving' || saveStatus === 'idle'} size="lg">
                <SaveButtonContent />
            </Button>
        </div>
    </div>
  );
}
    

    

    

    