export function formatPhone(phone: string): string {
  // "941141780" → "941 141 780"
  return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/51${phone}?text=${encoded}`;
}
