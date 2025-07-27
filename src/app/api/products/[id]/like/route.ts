import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Product } from '@/lib/products';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'products.json');
    
    let products: Product[] = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      products = JSON.parse(fileContent);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return NextResponse.json({ message: 'Products file not found.' }, { status: 404 });
      }
      throw error;
    }

    let productUpdated = false;
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        product.likes = (product.likes || 0) + 1;
        productUpdated = true;
      }
      return product;
    });

    if (!productUpdated) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(updatedProducts, null, 2), 'utf-8');

    const updatedProduct = updatedProducts.find(p => p.id === productId);

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Failed to like product:', error);
    return NextResponse.json({ message: 'Failed to like product' }, { status: 500 });
  }
}
