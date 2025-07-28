
import { NextResponse, type NextRequest } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import { adminDb } from '@/lib/firebase-admin'; // Ensures admin is initialized

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json({ message: 'Nom de fichier ou type de contenu manquant.' }, { status: 400 });
    }

    // Sanitize filename
    const sanitizedFilename = filename.replace(/\s/g, '_').replace(/[^\w.-]/g, '');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const finalFilename = `uploads/${uniqueSuffix}-${sanitizedFilename}`;

    const bucket = getStorage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    const file = bucket.file(finalFilename);

    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
    };

    const [uploadUrl] = await file.getSignedUrl(options);
    
    // Construct the public URL for download
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(finalFilename)}?alt=media`;

    return NextResponse.json({ uploadUrl, downloadUrl });

  } catch (error) {
    console.error('Erreur de génération d\'URL signée:', error);
    return NextResponse.json({ message: 'Impossible de générer l\'URL de téléversement.' }, { status: 500 });
  }
}
