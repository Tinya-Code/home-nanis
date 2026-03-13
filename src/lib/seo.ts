export interface SEOMeta {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function buildTitle(pageTitle: string, siteName = 'El Hogar de Nanis'): string {
  if (pageTitle.toLowerCase().includes('hogar de nanis')) return pageTitle;
  return `${pageTitle} | ${siteName}`;
}

export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(' ', maxLength)) + '…';
}
