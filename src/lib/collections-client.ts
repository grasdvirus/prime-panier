// Client-side functions for collections

import { type Collection } from './collections';

export async function getCollectionsClient(): Promise<Collection[]> {
    try {
        const response = await fetch(`/collections.json?v=${new Date().getTime()}`);
        if (!response.ok) {
            console.error('Failed to fetch collections.json:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to read or parse collections.json:', error);
        return [];
    }
}

export async function updateCollectionsClient(collections: Collection[]): Promise<void> {
  const response = await fetch('/admin/update-collections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(collections, null, 2),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update collections' }));
    throw new Error(errorData.message);
  }
}
