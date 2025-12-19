import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_SECRET = process.env.ADMIN_SECRET!;
const COOKIE_NAME = 'admin_session';

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === 'authenticated';
}

export async function requireAdmin() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    redirect('/admin/login');
  }
}

export function setAdminSessionCookie(): string {
  // Returns cookie string to be set in response headers
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  return `${COOKIE_NAME}=authenticated; HttpOnly; ${secure} SameSite=Lax; Max-Age=${maxAge}; Path=/`;
}

export function clearAdminSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/`;
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_SECRET;
}

