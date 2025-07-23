// Client-side functions for info features

import { type InfoFeature } from './info-features';

export async function getInfoFeaturesClient(): Promise<InfoFeature[]> {
    try {
        const response = await fetch(`/info-features.json?v=${new Date().getTime()}`);
        if (!response.ok) {
            console.error('Failed to fetch info-features.json:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to read or parse info-features.json:', error);
        return [];
    }
}

export async function updateInfoFeaturesClient(features: InfoFeature[]): Promise<void> {
  const response = await fetch('/admin/update-info-features', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(features, null, 2),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update info features' }));
    throw new Error(errorData.message);
  }
}
