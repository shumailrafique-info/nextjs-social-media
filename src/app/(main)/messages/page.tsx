import TrendsSidebar from "@/app/_components/trends-sidebar";
import { validateRequest } from "@/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

interface Props {}

const Page = async ({}: Props) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser)
    return <p>You&apos;r are not authrized to view this page </p>;
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-4">
        <div className="rounded-xl bg-card px-5 py-4 text-center shadow-md dark:border">
          Chatting feature is in progress will be available soon.
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;
