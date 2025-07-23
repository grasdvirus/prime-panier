// Client-side functions for bento

import { type Bento } from './bento';

export async function getBentoClient(): Promise<Bento[]> {
    try {
        const response = await fetch(`/bento.json?v=${new Date().getTime()}`);
        if (!response.ok) {
            console.error('Failed to fetch bento.json:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to read or parse bento.json:', error);
        return [];
    }
}

export async function updateBentoClient(bentoItems: Bento[]): Promise<void> {
  const response = await fetch('/admin/update-bento', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bentoItems, null, 2),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update bento items' }));
    throw new Error(errorData.message);
  }
}
