import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await validateRequest();

  if (!session) return redirect("/login");

  return <>{children}</>;
}
