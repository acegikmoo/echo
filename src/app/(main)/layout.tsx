import { AppBar } from "@/components/app-bar";

export default function MainLayout({
  children,
}: {
    children: React.ReactNode;
  }) {
  return (
  <main className="flex flex-col min-h-screen max-h-screen">
      <AppBar />
      <div className="flex-1 flex flex-col px-4 pb-4 pt-20">
      </div>
    </main>
  )
}
