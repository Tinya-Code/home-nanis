import type { Video } from './video';
import type { WhatsAppLine } from './whatsapp';

export interface ContactDetail {
  id: string;
  type: string;
  label: string;
  value: string;
  icon: string;
  link: string;
}

export interface SiteData {
  name: string;
  slogan: string;
  shortDescription: string;
  contact: {
    phone: string;
    mobile: string[];
    email: string;
    address: string;
    whatsapp: string;
    libroReclamacionesLink: string;
    whatsappLines: WhatsAppLine[];
  };
  businessHours: string;
  certifications: string[];
  localSeo: {
    targetLocations: string[];
    mainKeywords: string[];
    schemaLocalBusiness: object;
  };
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
  images: {
    logo: { alt: string; localPath: string };
    hero: { alt: string; localPath: string };
  };
  videos: Video[];
}
