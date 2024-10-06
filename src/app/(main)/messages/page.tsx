import Chat from "@/app/(main)/messages/Chat";
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
        <Chat />
      </div>
      {/* <TrendsSidebar /> */}
    </main>
  );
};

export default Page;
