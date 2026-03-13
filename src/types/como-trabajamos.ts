export interface PageSeo {
  title: string;
  description: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface ComoTrabajamosData {
  seo: PageSeo;
  title: string;
  subtitle: string;
  description: string;
  steps: StepItem[];
  differentiators: string[];
}
