
import { NextResponse, type NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdirp } from 'mkdirp';

// This is required for Vercel to use the Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: 'Aucun fichier trouvé.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create a unique name
    const sanitizedFilename = file.name.replace(/\s/g, '_').replace(/[^\w.-]/g, '');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const finalFilename = `${uniqueSuffix}-${sanitizedFilename}`;

    // Define the upload path
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const path = join(uploadDir, finalFilename);
    
    // Ensure the upload directory exists
    await mkdirp(uploadDir);

    // Write the file to the local filesystem
    await writeFile(path, buffer);

    const publicUrl = `/uploads/${finalFilename}`;

    return NextResponse.json({ message: 'Fichier téléversé avec succès.', url: publicUrl });

  } catch (error) {
    console.error('Erreur de téléversement:', error);
    return NextResponse.json({ message: 'Impossible de téléverser le fichier.' }, { status: 500 });
  }
}
