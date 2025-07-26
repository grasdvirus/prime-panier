'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { getProductsClient, updateProductsClient } from '@/lib/products-client';
import { getSlidesClient, updateSlidesClient } from '@/lib/slides-client';
import { getBentoClient, updateBentoClient } from '@/lib/bento-client';
import { getCollectionsClient, updateCollectionsClient } from '@/lib/collections-client';
import { getInfoFeaturesClient, updateInfoFeaturesClient } from '@/lib/info-features-client';
import { getMarqueeClient, updateMarqueeClient } from '@/lib/marquee-client';
import { getProductCategoriesClient } from '@/lib/products-client';
import { getOrdersClient, updateOrdersClient } from '@/lib/orders-client';
import { type Product } from '@/lib/products';
import { type Slide } from '@/lib/slides';
import { type Bento } from '@/lib/bento';
import { type Collection } from '@/lib/collections';
import { type InfoFeature } from '@/lib/info-features';
import { type Marquee } from '@/lib/marquee';
import { type Order, type OrderItem } from '@/lib/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, Package, RefreshCw } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'success';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [bentoItems, setBentoItems] = useState<Bento[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [infoFeatures, setInfoFeatures] = useState<InfoFeature[]>([]);
  const [marquee, setMarquee] = useState<Marquee>({ messages: [] });
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [bentoItemToDelete, setBentoItemToDelete] = useState<Bento | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const lastOrderCountRef = useRef<number>(0);

  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    const cats = await getProductCategoriesClient();
    setProductCategories(cats);
  }, []);

  const fetchOrders = useCallback(async (isInitialLoad = false) => {
    const ords = await getOrdersClient();
    setOrders(ords);

    if (isInitialLoad) {
      lastOrderCountRef.current = ords.length;
    } else if (ords.length > lastOrderCountRef.current) {
        toast({
            title: "Nouvelle commande !",
            description: `Vous avez reçu ${ords.length - lastOrderCountRef.current} nouvelle(s) commande(s).`,
        });
        notificationSoundRef.current?.play().catch(e => console.error("Error playing sound:", e));
    }
    lastOrderCountRef.current = ords.length;
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user?.email !== 'grasdvirus@gmail.com') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.email === 'grasdvirus@gmail.com') {
        notificationSoundRef.current = new Audio('/sons/notif.wav');

        async function loadData() {
            setLoading(true);
            const [prods, slds, bento, colls, info, marq, cats, ords] = await Promise.all([
                getProductsClient(), 
                getSlidesClient(),
                getBentoClient(),
                getCollectionsClient(),
                getInfoFeaturesClient(),
                getMarqueeClient(),
                getProductCategoriesClient(),
                getOrdersClient()
            ]);
            setProducts(prods.map(p => ({ ...p, images: p.images.length > 0 ? p.images : ['', ''] })));
            setSlides(slds);
            setBentoItems(bento);
            setCollections(colls);
            setInfoFeatures(info);
            setMarquee(marq);
            setProductCategories(cats);
            setOrders(ords);
            lastOrderCountRef.current = ords.length;
            setLoading(false);
            setSaveStatus('idle');
        }
        loadData();

        const intervalId = setInterval(() => fetchOrders(false), 30000); // Check for new orders every 30 seconds
        return () => clearInterval(intervalId);
    }
  }, [user, fetchOrders]);

  const markAsDirty = () => {
    if (saveStatus === 'idle' || saveStatus === 'success') {
      setSaveStatus('dirty');
    }
  }

  const handleInputChange = useCallback(<T extends { id: number }>(
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    id: number,
    field: keyof T,
    value: any
  ) => {
    setState(prevState =>
      prevState.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    markAsDirty();
  }, [saveStatus]);
  
  const handleOrderStatusChange = (orderId: number, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    markAsDirty();
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
  }, [saveStatus]);

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
  }, [saveStatus]);

  const handleMarqueeChange = useCallback((index: number, value: string) => {
    setMarquee(prev => {
        const newMessages = [...prev.messages];
        newMessages[index] = value;
        return { ...prev, messages: newMessages };
    });
    markAsDirty();
  }, [saveStatus]);

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
      reviews: 0,
      images: ['', ''],
      features: ['', '', ''],
      data_ai_hint: ''
    };
    setProducts(prev => [...prev, newProduct]);
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
  
  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(prev => prev.filter(order => order.id !== orderToDelete.id));
      markAsDirty();
      setOrderToDelete(null);
      toast({
        title: "Commande supprimée",
        description: `La commande de ${orderToDelete.customer.name} a été supprimée.`,
      });
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !productCategories.includes(newCategory)) {
        const updatedCategories = [...productCategories, newCategory];
        setProductCategories(updatedCategories);
        setNewCategory('');
        setIsAddCategoryDialogOpen(false);
        toast({
            title: "Catégorie ajoutée",
            description: `La catégorie "${newCategory}" a été ajoutée. N'oubliez pas de sauvegarder.`,
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
    setBentoItems(prev => [...prev, newBentoItem]);
    markAsDirty();
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
          updateOrdersClient(orders),
      ]);
      await fetchCategories();
      await fetchOrders(true); // Treat as initial load to reset counter
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
      setSaveStatus('dirty'); // Revert to dirty if save fails
    }
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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="orders" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <ScrollArea className="w-full sm:w-auto">
                <TabsList className="grid-cols-none">
                    <TabsTrigger value="orders">Commandes ({orders.length})</TabsTrigger>
                    <TabsTrigger value="products">Produits</TabsTrigger>
                    <TabsTrigger value="slides">Diaporama</TabsTrigger>
                    <TabsTrigger value="bento">Bento</TabsTrigger>
                    <TabsTrigger value="collections">Collections</TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="marquee">Bandeau</TabsTrigger>
                </TabsList>
            </ScrollArea>
             <Button onClick={handleSaveChanges} disabled={saveStatus === 'saving' || saveStatus === 'idle'} className="w-full sm:w-auto flex-shrink-0">
                <SaveButtonContent />
            </Button>
        </div>
        
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
                              <DialogDescription>
                                Cette catégorie sera disponible pour tous les produits.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Label htmlFor="new-category-name">Nom de la catégorie</Label>
                              <Input
                                id="new-category-name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                              />
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

        <TabsContent value="slides">
            <Card>
                <CardHeader><CardTitle>Gestion du Diaporama</CardTitle></CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader><TableRow><TableHead>Titre</TableHead><TableHead>Description</TableHead><TableHead className="w-[350px]">Image</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {slides.map((slide) => (
                        <TableRow key={slide.id}>
                            <TableCell><Input value={slide.title} onChange={e => handleInputChange(setSlides, slide.id, 'title', e.target.value)} /></TableCell>
                            <TableCell><Textarea value={slide.description} onChange={e => handleInputChange(setSlides, slide.id, 'description', e.target.value)} /></TableCell>
                            <TableCell><ImageUpload value={slide.imageUrl} onChange={(url) => handleInputChange(setSlides, slide.id, 'imageUrl', url)}/></TableCell>
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
        
        <TabsContent value="info">
             <Card>
                <CardHeader><CardTitle>Gestion de la Section Info</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {infoFeatures.map(item => (
                         <Card key={item.id} className="p-4">
                             <h3 className="font-semibold mb-2">{item.title}</h3>
                             <div className="grid gap-4">
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
                <CardHeader><CardTitle>Gestion du Bandeau Défilant</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {marquee.messages.map((message, index) => (
                        <div key={index} className="space-y-2">
                            <Label>Message {index + 1}</Label>
                            <Input 
                                value={message}
                                onChange={e => handleMarqueeChange(index, e.target.value)}
                            />
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

    </div>
  );
}
