import 'server-only';
import fs from 'fs/promises';
import path from 'path';

export type InfoFeature = {
  id: number;
  iconName: 'Lock' | 'Heart' | 'Phone';
  title: string;
  description: string;
};

let infoFeaturesCache: InfoFeature[] | null = null;

async function fetchInfoFeaturesOnServer(): Promise<InfoFeature[]> {
    if (infoFeaturesCache) {
        return infoFeaturesCache;
    }
    try {
        const filePath = path.join(process.cwd(), 'public', 'info-features.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const infoFeatures: InfoFeature[] = JSON.parse(fileContent);
        infoFeaturesCache = infoFeatures;
        return infoFeatures;
    } catch (error) {
        console.error('Failed to read or parse info-features.json:', error);
        return [];
    }
}

export async function getInfoFeatures(): Promise<InfoFeature[]> {
  return await fetchInfoFeaturesOnServer();
}
