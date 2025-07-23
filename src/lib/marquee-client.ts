// Client-side functions for marquee

import { type Marquee } from './marquee';

export async function getMarqueeClient(): Promise<Marquee> {
    try {
        const response = await fetch(`/marquee.json?v=${new Date().getTime()}`);
        if (!response.ok) {
            console.error('Failed to fetch marquee.json:', response.statusText);
            return { messages: [] };
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to read or parse marquee.json:', error);
        return { messages: [] };
    }
}

export async function updateMarqueeClient(marquee: Marquee): Promise<void> {
  const response = await fetch('/admin/update-marquee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(marquee, null, 2),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update marquee' }));
    throw new Error(errorData.message);
  }
}
