import { Skeleton } from "@/components/ui/skeleton";

interface Props {}

const PostSkeleton = ({}: Props) => {
  return (
    <>
      <Skeleton className="space-y-4 bg-white p-5">
        <Skeleton className="flex items-center space-x-4 bg-transparent">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Skeleton>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Skeleton>
      <Skeleton className="space-y-4 bg-white p-5">
        <Skeleton className="flex items-center space-x-4 bg-transparent">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Skeleton>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Skeleton>
      <Skeleton className="space-y-4 bg-white p-5">
        <Skeleton className="flex items-center space-x-4 bg-transparent">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Skeleton>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Skeleton>
    </>
  );
};

export default PostSkeleton;
