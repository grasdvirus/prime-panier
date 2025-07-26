import { NextResponse } from 'next/server';
import { createOrderFlow, OrderRequestSchema } from '@/ai/flows/order-flow';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Validate the incoming data using our Zod schema
    const parsedOrderData = OrderRequestSchema.parse(orderData);
    
    // Call the Genkit flow to handle order creation
    const result = await createOrderFlow(parsedOrderData);
    
    return NextResponse.json({ message: 'Order created successfully', orderId: result.orderId }, { status: 201 });

  } catch (error: any) {
    console.error('Order Creation API Error:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Invalid order data.', details: error.errors }, { status: 400 });
    }

    // Provide a more specific error message if available from the flow or other sources
    const errorMessage = error.message || 'An internal server error occurred.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
