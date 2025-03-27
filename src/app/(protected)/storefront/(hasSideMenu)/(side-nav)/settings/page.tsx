
import { redirect } from "next/navigation"

export default function Page() {
  // redirect to initial tab page
  redirect('settings/profile-information');
}