export interface Video {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  type?: 'short' | 'long' | 'intermediate';
}
