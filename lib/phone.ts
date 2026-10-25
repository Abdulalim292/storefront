export function formatBangladeshPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const nationalNumber = digits.startsWith('880') ? digits.slice(3) : digits.replace(/^0/, '');

  // Mobile numbers: 1XXX-XXXXXX. Dhaka landlines: 2 XXXXXXX (7–8 digits).
  if (/^1\d{9}$/.test(nationalNumber)) {
    return `+880 ${nationalNumber.slice(0, 4)}-${nationalNumber.slice(4)}`;
  }
  if (nationalNumber.startsWith('2') && (nationalNumber.length === 8 || nationalNumber.length === 9)) {
    return `+880 2 ${nationalNumber.slice(1)}`;
  }
  // Chattogram uses area code 031.
  if (nationalNumber.startsWith('31') && nationalNumber.length > 2) {
    return `+880 31 ${nationalNumber.slice(2)}`;
  }

  return `+880 ${nationalNumber}`;
}

export function toBangladeshTel(phone: string): string {
  return `tel:${formatBangladeshPhone(phone).replace(/\D/g, '')}`;
}
