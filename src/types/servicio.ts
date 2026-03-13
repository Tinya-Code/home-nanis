export interface Servicio {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  seoKeywords: string[];
  features: string[];
  image: {
    alt: string;
    localPath: string;
  };
}
