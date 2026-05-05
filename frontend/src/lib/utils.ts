export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('staylo_token');
}

export function setToken(token: string): void {
  localStorage.setItem('staylo_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('staylo_token');
}

export function getUser(): { id: string; name: string; email: string; role: string } | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('staylo_user');
  return data ? JSON.parse(data) : null;
}

export function setUser(user: { id: string; name: string; email: string; role: string }): void {
  localStorage.setItem('staylo_user', JSON.stringify(user));
}

export function removeUser(): void {
  localStorage.removeItem('staylo_user');
}

export function nightsBetween(checkin: string, checkout: string): number {
  const start = new Date(checkin);
  const end = new Date(checkout);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}
