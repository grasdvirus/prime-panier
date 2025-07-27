// Client-side functions for slides

import { type Slide } from './slides';

export async function getSlidesClient(): Promise<Slide[]> {
    const res = await fetch('/api/slides/get', { cache: 'no-store' });
    if (!res.ok) {
        console.error('Failed to fetch slides from API:', res.statusText);
        return [];
    }
    return res.json();
}

export async function updateSlidesClient(slides: Slide[]): Promise<void> {
  const response = await fetch('/admin/update-slides', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(slides),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update slides' }));
    throw new Error(errorData.message);
  }
}
