// src/lib/jsonld.ts
import type { WithContext, BreadcrumbList } from 'schema-dts';

/**
 * Genera el schema JSON-LD para BreadcrumbList
 */
export function buildBreadcrumb(items: { name: string; url: string }[]): string {
  const schema: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return JSON.stringify(schema);
}

/**
 * Genera el schema JSON-LD para LocalBusiness (con AggregateRating si aplica)
 */
export function buildLocalBusiness(data: any, rating?: { score: string; count: string }): string {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    ...data,
  };

  if (rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.score,
      reviewCount: rating.count.replace(/\D/g, ''),
      bestRating: "5"
    };
  }

  return JSON.stringify(schema);
}
