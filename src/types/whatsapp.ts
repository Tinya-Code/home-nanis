export interface WhatsAppLine {
  name: string;
  phone: string;
  description?: string;
  message?: string;
}

export interface WhatsAppProps {
  contacts?: WhatsAppLine[];
  position?: 'bottom-right' | 'bottom-left';
  popupTitle?: string;
  popupSubtitle?: string;
}
