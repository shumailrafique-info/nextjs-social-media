import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostEditor from "../_components/posts/post-editor/post-editor";
import TrendsSidebar from "../_components/trends-sidebar";
import FollowingPosts from "./_components/following-posts";
import ForYouPosts from "./_components/for-you-posts";

export default async function Home() {
  return (
    <>
      <main className="w-full min-w-0">
        <div className="w-full min-w-0 space-y-3">
          <PostEditor />
          <Tabs defaultValue="for-you" className="w-full space-y-3">
            <TabsList className="grid h-[45px] w-full grid-cols-2 !bg-gray-200 dark:!border dark:!bg-gray-50/5">
              <TabsTrigger value="for-you" className="py-2">
                For you
              </TabsTrigger>
              <TabsTrigger value="following" className="py-2">
                Following
              </TabsTrigger>
            </TabsList>
            <TabsContent value="for-you">
              <ForYouPosts />
            </TabsContent>
            <TabsContent value="following">
              <FollowingPosts />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <TrendsSidebar />
    </>
  );
}
