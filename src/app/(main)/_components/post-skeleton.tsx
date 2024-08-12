import { Skeleton } from "@/components/ui/skeleton";

interface Props {}

const PostSkeleton = ({}: Props) => {
  return (
    <div className="w-full space-y-3">
      <Skeleton className="space-y-3 rounded-2xl bg-white p-5 shadow-md dark:border dark:bg-transparent">
        <Skeleton className="flex items-center space-x-3 bg-transparent">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[170px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </Skeleton>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Skeleton>
      <Skeleton className="space-y-3 rounded-2xl bg-white p-5 shadow-md dark:border dark:bg-transparent">
        <Skeleton className="flex items-center space-x-3 bg-transparent">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[170px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </Skeleton>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Skeleton>
      <Skeleton className="space-y-3 rounded-2xl bg-white p-5 shadow-md dark:border dark:bg-transparent">
        <Skeleton className="flex items-center space-x-3 bg-transparent">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[170px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </Skeleton>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Skeleton>
    </div>
  );
};

export default PostSkeleton;
