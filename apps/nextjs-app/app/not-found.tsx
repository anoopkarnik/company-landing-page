import { redirect } from 'next/navigation';

export default function NotFound() {
  redirect("/landing"); // Redirect to landing page (home)

  return null; // This prevents flickering
}

