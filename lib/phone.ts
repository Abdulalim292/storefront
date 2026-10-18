export function formatBangladeshPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const nationalNumber = digits.startsWith('880') ? digits.slice(3) : digits.replace(/^0/, '');

  return `+880 ${nationalNumber}`;
}

export function toBangladeshTel(phone: string): string {
  return `tel:${formatBangladeshPhone(phone).replace(/\D/g, '')}`;
}
