'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { getProductsClient, updateProductsClient } from '@/lib/products-client';
import { type Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user?.email !== 'grasdvirus@gmail.com') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const prods = await getProductsClient();
      setProducts(prods);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const handleInputChange = (productId: number, field: keyof Product, value: string | number) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const updatedProduct = { ...p, [field]: value };
          // Ensure numeric fields are numbers
          if (field === 'price' || field === 'stock' || field === 'rating' || field === 'reviews') {
             updatedProduct[field] = Number(value);
          }
          return updatedProduct;
        }
        return p;
      })
    );
  };
  
  const handleFeatureChange = (productId: number, featureIndex: number, value: string) => {
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

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await updateProductsClient(products);
      toast({
        title: 'Succès',
        description: 'Les produits ont été mis à jour.',
      });
    } catch (error) {
      console.error('Failed to save products:', error);
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Produits</CardTitle>
          <Button onClick={handleSaveChanges} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Enregistrer les modifications
          </Button>
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
                {products.map((product, pIndex) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Input value={product.images[0]} onChange={e => handleInputChange(product.id, 'images', [e.target.value])} className="text-xs" />
                    </TableCell>
                    <TableCell>
                      <Input value={product.name} onChange={e => handleInputChange(product.id, 'name', e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Textarea value={product.description} onChange={e => handleInputChange(product.id, 'description', e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={product.price} onChange={e => handleInputChange(product.id, 'price', e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={product.stock} onChange={e => handleInputChange(product.id, 'stock', e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Input value={product.category} onChange={e => handleInputChange(product.id, 'category', e.target.value)} />
                    </TableCell>
                     <TableCell>
                        <div className="space-y-2">
                        {product.features.map((feature, fIndex) => (
                            <Input 
                                key={fIndex} 
                                value={feature} 
                                onChange={e => handleFeatureChange(product.id, fIndex, e.target.value)} 
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
    </div>
  );
}
