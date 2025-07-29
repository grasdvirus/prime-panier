// Client-side functions for settings
import { type SiteSettings } from './settings';

const defaultSettings: SiteSettings = {
  productsPerPage: 8,
};

export async function getSiteSettingsClient(): Promise<SiteSettings> {
    try {
        const res = await fetch('/api/settings/get', { cache: 'no-store' });
        if (!res.ok) {
            console.error('Failed to fetch settings from API:', res.statusText);
            return defaultSettings;
        }
        const settings = await res.json();
        return { ...defaultSettings, ...settings };
    } catch (error) {
        console.error('Failed to fetch settings from API:', error);
        return defaultSettings;
    }
}

export async function updateSiteSettingsClient(settings: SiteSettings): Promise<void> {
  const response = await fetch('/admin/update-settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update settings' }));
    throw new Error(errorData.message);
  }
}
