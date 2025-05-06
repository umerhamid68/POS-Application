import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { LoginForm } from 'components';

export default async function LoginPage() {
  //check if user is already authenticated
  const session = await getServerSession(authOptions);
  
  //if session exists, redirect to home page
  if (session) {
    redirect('/home');
  }
  
  //otherwise, render the login form
  return <LoginForm />;
}