export interface JobOffer {
  position: string;
  location: string;
  description: string;
  active?: boolean;
}

export interface ApplicationForm {
  title: string;
  description: string;
  link: string;
}

export interface JobBoardData {
  seo: {
    title: string;
    description: string;
  };
  title: string;
  subtitle: string;
  description: string;
  requirements: string[];
  benefits: string[];
  jobOffers: JobOffer[];
  applicationForm: ApplicationForm;
}
