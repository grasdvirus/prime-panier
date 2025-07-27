// Client-side functions for collections

import { type Collection } from './collections';

export async function getCollectionsClient(): Promise<Collection[]> {
    const res = await fetch('/api/collections/get', { cache: 'no-store' });
    if (!res.ok) {
        console.error('Failed to fetch collections from API:', res.statusText);
        return [];
    }
    return res.json();
}

export async function updateCollectionsClient(collections: Collection[]): Promise<void> {
  const response = await fetch('/admin/update-collections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(collections),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update collections' }));
    throw new Error(errorData.message);
  }
}
