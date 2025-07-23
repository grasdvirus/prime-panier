import 'server-only';
import fs from 'fs/promises';
import path from 'path';

export type Bento = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  className: string;
  data_ai_hint: string;
};

async function fetchBentoOnServer(): Promise<Bento[]> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'bento.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const bentoItems: Bento[] = JSON.parse(fileContent);
        return bentoItems;
    } catch (error) {
        console.error('Failed to read or parse bento.json:', error);
        return [];
    }
}


export async function getBento(): Promise<Bento[]> {
  return await fetchBentoOnServer();
}
