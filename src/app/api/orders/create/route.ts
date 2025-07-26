import { NextResponse } from 'next/server';
import { createOrder, type OrderRequest } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const orderData: OrderRequest = await request.json();
    
    if (!orderData || !orderData.customer || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ message: 'Données de commande invalides ou incomplètes.' }, { status: 400 });
    }
    
    await createOrder(orderData);
    
    return NextResponse.json({ message: 'Order created successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('Order Creation API Error:', error);
    const errorMessage = error.message || 'Erreur interne du serveur.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
