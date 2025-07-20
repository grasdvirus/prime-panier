import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Product } from '@/lib/products';

export async function POST(request: Request) {
  try {
    const products: Product[] = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'products.json');
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error('Failed to write products.json:', error);
    return NextResponse.json({ message: 'Failed to update products' }, { status: 500 });
  }
}
