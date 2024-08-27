import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button variant={'default'}>Apply for 10MG Credit</Button>
      <Button variant={'destructive'}>Apply for 10MG Credit</Button>
      <Button variant={'ghost'}>Apply for 10MG Credit</Button>
      <Button variant={'link'}>Apply for 10MG Credit</Button>
      <Button variant={'outline'}>Apply for 10MG Credit</Button>
      <Button variant={'secondary'}>Apply for 10MG Credit</Button>
    </main>
  );
}
