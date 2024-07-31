import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/app/(main)/_providers/session-provider";
import Navbar from "./_components/navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) return redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col items-center">
        <Navbar />
        <div className="w-full max-w-7xl">{children}</div>
      </div>
    </SessionProvider>
  );
}
