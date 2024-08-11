import TrendsSidebar from "@/app/_components/trends-sidebar";
import BookmarkedPosts from "../_components/bookmarked-posts";
import { validateRequest } from "@/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
};

const UserProfilePage = async ({}) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser)
    return <p>You&apos;r are not authrized to view this page </p>;

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-4">
        <div className="rounded-xl bg-card px-5 py-4 text-center shadow-md dark:border">
          <h2 className="text-2xl font-semibold">Bookmarks</h2>
        </div>
        <BookmarkedPosts />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default UserProfilePage;
