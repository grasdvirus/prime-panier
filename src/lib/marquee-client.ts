// Client-side functions for marquee

import { type Marquee } from './marquee';

export async function getMarqueeClient(): Promise<Marquee> {
    const res = await fetch('/api/marquee/get', { cache: 'no-store' });
    if (!res.ok) {
        console.error('Failed to fetch marquee from API:', res.statusText);
        return { messages: [] };
    }
    return res.json();
}

export async function updateMarqueeClient(marquee: Marquee): Promise<void> {
  const response = await fetch('/admin/update-marquee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(marquee),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update marquee' }));
    throw new Error(errorData.message);
  }
}
