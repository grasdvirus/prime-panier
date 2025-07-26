import { NextResponse } from 'next/server';
import { createOrder, type OrderRequest } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const orderData: OrderRequest = await request.json();
    
    // Basic validation
    if (!orderData.customer || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ message: 'Invalid order data.' }, { status: 400 });
    }
    
    await createOrder(orderData);
    
    // Here you could add email sending logic to notify the admin
    // e.g. using Nodemailer, Resend, etc.
    // console.log('New order received for:', orderData.customer.name);

    return NextResponse.json({ message: 'Order created successfully' });

  } catch (error) {
    console.error('Order Creation API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
