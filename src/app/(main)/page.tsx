import PostEditor from "../_components/posts/post-editor/post-editor";
import TrendsSidebar from "../_components/trends-sidebar";
import ForYouPosts from "./_components/for-you-posts";

export default async function Home() {
  return (
    <>
      <main className="w-full min-w-0">
        <div className="w-full min-w-0 space-y-3">
          <PostEditor />
          <ForYouPosts />
        </div>
      </main>
      <TrendsSidebar />
    </>
  );
}
