'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { getProductsClient, updateProductsClient } from '@/lib/products-client';
import { getSlidesClient, updateSlidesClient } from '@/lib/slides-client';
import { type Product } from '@/lib/products';
import { type Slide } from '@/lib/slides';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user?.email !== 'grasdvirus@gmail.com') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prods, slds] = await Promise.all([getProductsClient(), getSlidesClient()]);
      setProducts(prods);
      setSlides(slds);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleProductInputChange = (productId: number, field: keyof Product, value: string | number) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const updatedProduct = { ...p, [field]: value };
          if (field === 'price' || field === 'stock' || field === 'rating' || field === 'reviews') {
             updatedProduct[field] = Number(value);
          }
          return updatedProduct;
        }
        return p;
      })
    );
  };
  
  const handleProductFeatureChange = (productId: number, featureIndex: number, value: string) => {
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
  }

  const handleSlideInputChange = (slideId: number, field: keyof Slide, value: string) => {
    setSlides(prevSlides =>
      prevSlides.map(s => (s.id === slideId ? { ...s, [field]: value } : s))
    );
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await Promise.all([
          updateProductsClient(products),
          updateSlidesClient(slides)
      ]);
      toast({
        title: 'Succès',
        description: 'Les données ont été mises à jour.',
      });
    } catch (error) {
      console.error('Failed to save data:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les modifications.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
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
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="products">
        <div className="flex justify-between items-center mb-4">
            <TabsList>
                <TabsTrigger value="products">Produits</TabsTrigger>
                <TabsTrigger value="slides">Diaporama</TabsTrigger>
            </TabsList>
             <Button onClick={handleSaveChanges} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enregistrer les modifications
            </Button>
        </div>

        <TabsContent value="products">
            <Card>
                <CardHeader>
                    <CardTitle>Gestion des Produits</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
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
                            <TableCell>
                            <Input value={product.images[0]} onChange={e => handleProductInputChange(product.id, 'images', [e.target.value])} className="text-xs" />
                            </TableCell>
                            <TableCell>
                            <Input value={product.name} onChange={e => handleProductInputChange(product.id, 'name', e.target.value)} />
                            </TableCell>
                            <TableCell>
                            <Textarea value={product.description} onChange={e => handleProductInputChange(product.id, 'description', e.target.value)} />
                            </TableCell>
                            <TableCell>
                            <Input type="number" value={product.price} onChange={e => handleProductInputChange(product.id, 'price', e.target.value)} />
                            </TableCell>
                            <TableCell>
                            <Input type="number" value={product.stock} onChange={e => handleProductInputChange(product.id, 'stock', e.target.value)} />
                            </TableCell>
                            <TableCell>
                            <Input value={product.category} onChange={e => handleProductInputChange(product.id, 'category', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                {product.features.map((feature, fIndex) => (
                                    <Input 
                                        key={fIndex} 
                                        value={feature} 
                                        onChange={e => handleProductFeatureChange(product.id, fIndex, e.target.value)} 
                                    />
                                ))}
                                </div>
                            </TableCell>
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
                <CardHeader>
                    <CardTitle>Gestion du Diaporama</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-1/3">Titre</TableHead>
                        <TableHead className="w-1/3">Description</TableHead>
                        <TableHead className="w-1/3">URL de l'image</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {slides.map((slide) => (
                        <TableRow key={slide.id}>
                            <TableCell>
                                <Input value={slide.title} onChange={e => handleSlideInputChange(slide.id, 'title', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <Textarea value={slide.description} onChange={e => handleSlideInputChange(slide.id, 'description', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <Input value={slide.imageUrl} onChange={e => handleSlideInputChange(slide.id, 'imageUrl', e.target.value)} />
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
