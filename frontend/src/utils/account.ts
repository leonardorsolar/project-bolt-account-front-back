export function generateAccountNumber(): string {
  const number = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  const digit = Math.floor(Math.random() * 9);
  return `${number}-${digit}`;
}