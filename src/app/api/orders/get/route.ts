
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic'; // Ensures the function is always run dynamically

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'orders.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const orders = JSON.parse(fileContent);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to get orders:', error);
    // If the file doesn't exist, return an empty array, which is not an error.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return NextResponse.json([]);
    }
    return NextResponse.json({ message: 'Failed to retrieve orders' }, { status: 500 });
  }
}
