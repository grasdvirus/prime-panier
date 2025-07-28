'use server';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import mkdirp from 'mkdirp';

// This is required for Vercel to use the Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file found.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdirp(uploadDir);

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, '_')}`;
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);

    // Return the public path
    const publicPath = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, path: publicPath });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: `Something went wrong: ${error.message}` }, { status: 500 });
  }
}
