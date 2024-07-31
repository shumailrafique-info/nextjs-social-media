import { validateRequest } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

interface Props {}

const TrendsSidebar = ({}: Props) => {
  return (
    <div className="sticky top-[5rem] hidden h-fit flex-none space-y-5 rounded-2xl md:block xl:w-80">
      <Suspense fallback={<Loader2 className="mx-auto mt-2 animate-spin" />}>
        <ShowNotFollowingList />
        <TrendingHashTags />
      </Suspense>
    </div>
  );
};

export default TrendsSidebar;

const ShowNotFollowingList = async () => {
  const { user } = await validateRequest();

  if (!user) return null;

  const notFollowingList = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    select: userDataSelect,
    take: 5,
  });

  return (
    <div className="space-y-4 rounded-2xl bg-card p-5 shadow-md dark:border">
      <h3 className="text-xl font-bold">You may follow</h3>
      {notFollowingList?.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-2"
          >
            <Avatar className="max-h-[40px] max-w-[40px]">
              <AvatarImage src={user.avatarUrl || ""} alt={user.displayName} />
              <AvatarFallback>SR</AvatarFallback>
            </Avatar>
            <div>
              <p className="line-clamp-1 break-all font-[500] leading-[1.3] hover:underline">
                {user?.displayName}
              </p>
              <p className="line-clamp-1 break-all text-[12px] text-muted-foreground">
                @{user?.username}
              </p>
            </div>
          </Link>
          <Button className="rounded-2xl">Follow</Button>
        </div>
      ))}
    </div>
  );
};

const getTrendingTopics = unstable_cache(
  async () => {
    const topics = await prisma.$queryRaw<{ hashtag: string; count: BigInt }[]>`
    SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
    FROM posts
    GROUP BY hashtag
    ORDER BY count DESC, hashtag ASC
    LIMIT 5;
  `;

    return topics.map((topic) => ({
      hashtag: topic.hashtag,
      count: Number(topic.count),
    }));
  },
  ["trending-topics"],
  {
    revalidate: 60 * 60 * 3,
  }
);

const TrendingHashTags = async () => {
  const { user } = await validateRequest();

  if (!user) return null;

  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-4 rounded-2xl bg-card p-5 shadow-md dark:border">
      <h3 className="text-xl font-bold">Trending topics</h3>
      {trendingTopics?.map((topic) => {
        const title = topic.hashtag.split("#")[1];
        return (
          <Link
            href={`/hashtags/${title}`}
            key={topic.hashtag}
            className="block"
          >
            <p
              title={title}
              className="line-clamp-1 break-all font-[500] hover:underline"
            >
              #{title}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(topic?.count)}{" "}
              {topic?.count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
