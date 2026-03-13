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
  };
  businessHours: string;
  certifications: string[];
}
