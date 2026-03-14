export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  slug: string;
  icon: string;
  items: FAQItem[];
}

export interface FAQData {
  title: string;
  subtitle: string;
  categories: FAQCategory[];
}
