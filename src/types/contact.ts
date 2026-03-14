export interface ContactItem {
  id: string;
  type: 'Phone' | 'Mobile' | 'WhatsApp' | 'Email' | 'Location';
  label: string;
  value: string;
  icon: string;
  link: string;
}

export interface BusinessHours {
  title: string;
  days: string;
  weekends: string;
}

export interface LegalData {
  libroReclamaciones: {
    text: string;
    image: {
      alt: string;
      localPath: string;
    };
  };
}

export interface ContactData {
  seo: {
    title: string;
    description: string;
  };
  title: string;
  subtitle: string;
  description: string;
  contactDetails: ContactItem[];
  businessHours: BusinessHours;
  legal: LegalData;
}
