import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/app/(main)/_providers/session-provider";
import Navbar from "./_components/navbar";
import MenuBar from "./_components/menu-bar";

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
        <div className="flex w-full max-w-7xl grow gap-5 px-5 py-5 xl:px-0">
          <MenuBar className="sticky top-[5rem] hidden h-fit flex-none space-y-2 rounded-2xl bg-card px-3 py-5 shadow-md dark:border sm:block lg:px-5 xl:w-72" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t-[2px] bg-card px-3 py-2 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
