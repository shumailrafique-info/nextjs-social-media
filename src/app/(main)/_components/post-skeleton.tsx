import { Skeleton } from "@/components/ui/skeleton";

interface Props {}

const PostSkeleton = ({}: Props) => {
  return (
    <>
      <Skeleton className="space-y-3 bg-white p-5">
        <Skeleton className="flex items-center space-x-3 bg-transparent">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[170px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </Skeleton>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Skeleton>
      <Skeleton className="space-y-3 bg-white p-5">
        <Skeleton className="flex items-center space-x-3 bg-transparent">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[170px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </Skeleton>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Skeleton>
      <Skeleton className="space-y-3 bg-white p-5">
        <Skeleton className="flex items-center space-x-3 bg-transparent">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[170px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </Skeleton>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Skeleton>
    </>
  );
};

export default PostSkeleton;
