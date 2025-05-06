import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return <>{children}</>;
}