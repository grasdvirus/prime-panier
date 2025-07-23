import 'server-only';
import fs from 'fs/promises';
import path from 'path';

export type Collection = {
  id: number;
  name: string;
  href: string;
  image: string;
  data_ai_hint: string;
};

async function fetchCollectionsOnServer(): Promise<Collection[]> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'collections.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const collections: Collection[] = JSON.parse(fileContent);
        return collections;
    } catch (error) {
        console.error('Failed to read or parse collections.json:', error);
        return [];
    }
}

export async function getCollections(): Promise<Collection[]> {
  return await fetchCollectionsOnServer();
}
