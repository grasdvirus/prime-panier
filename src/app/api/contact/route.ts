import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Tous les champs sont requis.' }, { status: 400 });
    }

    // In a real app, you would send an email, save to a database, etc.
    // For this example, we'll just log it to the server console.
    console.log('Nouveau message de contact:');
    console.log('Nom:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    
    // You can add your email sending logic here using a service like Nodemailer, Resend, or SendGrid.

    return NextResponse.json({ message: 'Message reçu avec succès !' });

  } catch (error) {
    console.error('Erreur API Contact:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
