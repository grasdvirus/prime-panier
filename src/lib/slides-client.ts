// Client-side functions for slides

import { type Slide } from './slides';

export async function getSlidesClient(): Promise<Slide[]> {
    try {
        const response = await fetch(`/slides.json?v=${new Date().getTime()}`);
        if (!response.ok) {
            console.error('Failed to fetch slides.json:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to read or parse slides.json:', error);
        return [];
    }
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
