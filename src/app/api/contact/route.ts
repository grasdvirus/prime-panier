import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

    const filePath = path.join(process.cwd(), 'public', 'messages.json');
    let messages: Message[] = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      messages = JSON.parse(fileContent);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    messages.unshift(newMessage);
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Message reçu avec succès !' });

  } catch (error) {
    console.error('Erreur API Contact:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
