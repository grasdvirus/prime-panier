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

let bentoCache: Bento[] | null = null;

async function fetchBentoOnServer(): Promise<Bento[]> {
    if (bentoCache) {
        return bentoCache;
    }
    try {
        const filePath = path.join(process.cwd(), 'public', 'bento.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const bentoItems: Bento[] = JSON.parse(fileContent);
        bentoCache = bentoItems;
        return bentoItems;
    } catch (error) {
        console.error('Failed to read or parse bento.json:', error);
        return [];
    }
}


export async function getBento(): Promise<Bento[]> {
  return await fetchBentoOnServer();
}
