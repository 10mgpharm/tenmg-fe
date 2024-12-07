import { redirect } from 'next/navigation';

export default function Page() {
    // redirect to initial tab page
    redirect('system-setup/medication_setup');
}
