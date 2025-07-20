import 'server-only';
import fs from 'fs/promises';
import path from 'path';

export type Slide = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  data_ai_hint: string;
};

let slidesCache: Slide[] | null = null;

async function fetchSlidesOnServer(): Promise<Slide[]> {
    if (slidesCache) {
        return slidesCache;
    }
    try {
        const filePath = path.join(process.cwd(), 'public', 'slides.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const slides: Slide[] = JSON.parse(fileContent);
        slidesCache = slides;
        return slides;
    } catch (error) {
        console.error('Failed to read or parse slides.json:', error);
        return [];
    }
}


export async function getSlides(): Promise<Slide[]> {
  return await fetchSlidesOnServer();
}
