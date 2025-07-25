import 'server-only';
import fs from 'fs/promises';
import path from 'path';

export type Marquee = {
  messages: string[];
};

async function fetchMarqueeOnServer(): Promise<Marquee> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'marquee.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const marquee: Marquee = JSON.parse(fileContent);
        return marquee;
    } catch (error) {
        console.error('Failed to read or parse marquee.json:', error);
        return { messages: [] };
    }
}

export async function getMarquee(): Promise<Marquee> {
  return await fetchMarqueeOnServer();
}
