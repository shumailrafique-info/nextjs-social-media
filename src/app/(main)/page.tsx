import prisma from "@/lib/prisma";
import PostEditor from "../_components/posts/post-editor/post-editor";
import Post from "../_components/posts/post";
import { postDataInclude } from "@/lib/types";
import TrendsSidebar from "../_components/trends-sidebar";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: postDataInclude,
  });
  return (
    <>
      <main className="w-full min-w-0">
        <div className="w-full min-w-0 space-y-3">
          <PostEditor />
          {posts.length > 0 ? (
            posts.map((post) => <Post post={post} key={post.id} />)
          ) : (
            <p className="text-center">No posts yet.</p>
          )}
        </div>
      </main>
      <TrendsSidebar />
    </>
  );
}
