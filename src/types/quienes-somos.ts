export interface PageSeo {
  title: string;
  description: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

export interface TeamSection {
  title: string;
  description: string;
  image: {
    alt: string;
    localPath: string;
  };
}

export interface PageImage {
  alt: string;
  localPath: string;
}

export interface QuienesSomosData {
  seo: PageSeo;
  title: string;
  subtitle: string;
  history: string;
  mission: string;
  vision: string;
  values: ValueItem[];
  teamSection: TeamSection;
  founder: {
    name: string;
    role: string;
    bio: string;
    image: {
      alt: string;
      localPath: string;
    };
  };
  images: PageImage[];
}
