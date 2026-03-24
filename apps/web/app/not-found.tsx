import { redirect } from 'next/navigation';

export default function NotFound(): React.ReactNode {
  redirect("/"); // Redirect to landing page (home)

  return null; // This prevents flickering
}

