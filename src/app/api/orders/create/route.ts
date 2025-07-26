import { NextResponse } from 'next/server';
import { type OrderRequest } from '@/lib/orders';
import { createOrderFlow } from '@/ai/flows/order-flow';

export async function POST(request: Request) {
  try {
    const orderData: OrderRequest = await request.json();
    
    // Basic validation
    if (!orderData || !orderData.customer || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ message: 'Données de commande invalides ou incomplètes.' }, { status: 400 });
    }
    
    // Call the Genkit flow to handle order creation
    await createOrderFlow(orderData);
    
    return NextResponse.json({ message: 'Order created successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('Order Creation API Error:', error);
    // Provide a more specific error message if available from the flow
    const errorMessage = error.message || 'Erreur interne du serveur.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
