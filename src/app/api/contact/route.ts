import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Tous les champs sont requis.' }, { status: 400 });
    }
    
    const newMessage: Message = {
      id: new Date().getTime().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const messageRef = adminDb.collection('messages').doc(newMessage.id);
    await messageRef.set(newMessage);

    return NextResponse.json({ message: 'Message reçu avec succès !' });

  } catch (error) {
    console.error('Erreur API Contact:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
