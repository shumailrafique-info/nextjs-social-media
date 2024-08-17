import TrendsSidebar from "@/app/_components/trends-sidebar";
import { validateRequest } from "@/auth";
import { Metadata } from "next";
import Notifications from "./_components/notificaitons";

export const metadata: Metadata = {
  title: "Notifications",
};

interface Props {}

const NotificationPage = async ({}: Props) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser)
    return <p>You&apos;r are not authrized to view this page </p>;
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-4">
        <div className="rounded-xl bg-card px-5 py-4 text-center shadow-md dark:border">
          <h2 className="text-2xl font-semibold">Notifications</h2>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default NotificationPage;
