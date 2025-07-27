// Client-side functions for info features

import { type InfoFeature } from './info-features';

export async function getInfoFeaturesClient(): Promise<InfoFeature[]> {
    const res = await fetch('/api/info-features/get', { cache: 'no-store' });
    if (!res.ok) {
        console.error('Failed to fetch info-features from API:', res.statusText);
        return [];
    }
    return res.json();
}

export async function updateInfoFeaturesClient(features: InfoFeature[]): Promise<void> {
  const response = await fetch('/admin/update-info-features', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(features),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update info features' }));
    throw new Error(errorData.message);
  }
}
