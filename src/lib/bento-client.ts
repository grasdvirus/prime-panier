// Client-side functions for bento

import { type Bento } from './bento';

export async function getBentoClient(): Promise<Bento[]> {
    const res = await fetch('/api/bento/get', { cache: 'no-store' });
    if (!res.ok) {
        console.error('Failed to fetch bento items from API:', res.statusText);
        return [];
    }
    return res.json();
}

export async function updateBentoClient(bentoItems: Bento[]): Promise<void> {
  const response = await fetch('/admin/update-bento', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bentoItems),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update bento items' }));
    throw new Error(errorData.message);
  }
}
