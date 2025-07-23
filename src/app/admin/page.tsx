'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { getProductsClient, updateProductsClient } from '@/lib/products-client';
import { getSlidesClient, updateSlidesClient } from '@/lib/slides-client';
import { getBentoClient, updateBentoClient } from '@/lib/bento-client';
import { getCollectionsClient, updateCollectionsClient } from '@/lib/collections-client';
import { getInfoFeaturesClient, updateInfoFeaturesClient } from '@/lib/info-features-client';
import { getMarqueeClient, updateMarqueeClient } from '@/lib/marquee-client';
import { type Product } from '@/lib/products';
import { type Slide } from '@/lib/slides';
import { type Bento } from '@/lib/bento';
import { type Collection } from '@/lib/collections';
import { type InfoFeature } from '@/lib/info-features';
import { type Marquee } from '@/lib/marquee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/admin/image-upload';

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
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user?.email !== 'grasdvirus@gmail.com') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.email === 'grasdvirus@gmail.com') {
        async function loadData() {
            setLoading(true);
            const [prods, slds, bento, colls, info, marq] = await Promise.all([
                getProductsClient(), 
                getSlidesClient(),
                getBentoClient(),
                getCollectionsClient(),
                getInfoFeaturesClient(),
                getMarqueeClient(),
            ]);
            setProducts(prods);
            setSlides(slds);
            setBentoItems(bento);
            setCollections(colls);
            setInfoFeatures(info);
            setMarquee(marq);
            setLoading(false);
            setSaveStatus('idle');
        }
        loadData();
    }
  }, [user]);

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

  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    try {
      await Promise.all([
          updateProductsClient(products),
          updateSlidesClient(slides),
          updateBentoClient(bentoItems),
          updateCollectionsClient(collections),
          updateInfoFeaturesClient(infoFeatures),
          updateMarqueeClient(marquee),
      ]);
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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="products" className="w-full">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <TabsList>
                <TabsTrigger value="products">Produits</TabsTrigger>
                <TabsTrigger value="slides">Diaporama</TabsTrigger>
                <TabsTrigger value="bento">Grille Bento</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="info">Section Info</TabsTrigger>
                <TabsTrigger value="marquee">Bandeau</TabsTrigger>
            </TabsList>
             <Button onClick={handleSaveChanges} disabled={saveStatus === 'saving' || saveStatus === 'idle'}>
                <SaveButtonContent />
            </Button>
        </div>

        <TabsContent value="products">
            <Card>
                <CardHeader><CardTitle>Gestion des Produits</CardTitle></CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[350px]">Image</TableHead>
                            <TableHead className="min-w-[200px]">Nom</TableHead>
                            <TableHead className="min-w-[300px]">Description</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead className="min-w-[250px]">Caractéristiques</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell><ImageUpload value={product.images[0]} onChange={(url) => handleInputChange(setProducts, product.id, 'images', [url])} /></TableCell>
                            <TableCell><Input value={product.name} onChange={e => handleInputChange(setProducts, product.id, 'name', e.target.value)} /></TableCell>
                            <TableCell><Textarea value={product.description} onChange={e => handleInputChange(setProducts, product.id, 'description', e.target.value)} /></TableCell>
                            <TableCell><Input type="number" value={product.price} onChange={e => handleInputChange(setProducts, product.id, 'price', Number(e.target.value))} /></TableCell>
                            <TableCell><Input type="number" value={product.stock} onChange={e => handleInputChange(setProducts, product.id, 'stock', Number(e.target.value))} /></TableCell>
                            <TableCell><Input value={product.category} onChange={e => handleInputChange(setProducts, product.id, 'category', e.target.value)} /></TableCell>
                            <TableCell><div className="space-y-2">{product.features.map((feature, fIndex) => (<Input key={fIndex} value={feature} onChange={e => handleProductFeatureChange(product.id, fIndex, e.target.value)} />))}</div></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
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
                <CardHeader><CardTitle>Gestion de la Grille Bento</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {bentoItems.map(item => (
                        <Card key={item.id} className="p-4">
                            <h3 className="font-semibold mb-2">Élément {item.id}</h3>
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
                                   <Label>Lien de redirection</Label>
                                   <Input value={item.href} onChange={e => handleInputChange(setBentoItems, item.id, 'href', e.target.value)} />
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
                            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Lien</TableHead><TableHead className="w-[350px]">Image</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {collections.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell><Input value={item.name} onChange={e => handleInputChange(setCollections, item.id, 'name', e.target.value)} /></TableCell>
                                        <TableCell><Input value={item.href} onChange={e => handleInputChange(setCollections, item.id, 'href', e.target.value)} /></TableCell>
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
    </div>
  );
}
