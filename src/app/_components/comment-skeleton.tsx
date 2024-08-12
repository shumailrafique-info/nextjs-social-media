import { Skeleton } from "@/components/ui/skeleton";

interface Props {}

const CommentSkeleton = ({}: Props) => {
  return (
    <div className="space-y-2">
      <Skeleton className="space-y-3 border-b-[1.5px] border-gray-200 bg-white pb-2 dark:border dark:bg-transparent">
        <Skeleton className="flex items-center space-x-2 bg-transparent">
          <Skeleton className="h-10 min-h-10 w-10 min-w-10 rounded-full" />
          <div className="w-full space-y-1">
            <Skeleton className="h-3.5 w-[170px]" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        </Skeleton>
      </Skeleton>
      <Skeleton className="space-y-3 border-b-[1.5px] border-gray-200 bg-white pb-2 dark:border dark:bg-transparent">
        <Skeleton className="flex items-center space-x-2 bg-transparent">
          <Skeleton className="h-10 min-h-10 w-10 min-w-10 rounded-full" />
          <div className="w-full space-y-1">
            <Skeleton className="h-3.5 w-[170px]" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        </Skeleton>
      </Skeleton>
      <Skeleton className="space-y-3 border-b-[1.5px] border-gray-200 bg-white pb-2 dark:border dark:bg-transparent">
        <Skeleton className="flex items-center space-x-2 bg-transparent">
          <Skeleton className="h-10 min-h-10 w-10 min-w-10 rounded-full" />
          <div className="w-full space-y-1">
            <Skeleton className="h-3.5 w-[170px]" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        </Skeleton>
      </Skeleton>
      <Skeleton className="space-y-3 border-b-[1.5px] border-gray-200 bg-white pb-2 dark:border dark:bg-transparent">
        <Skeleton className="flex items-center space-x-2 bg-transparent">
          <Skeleton className="h-10 min-h-10 w-10 min-w-10 rounded-full" />
          <div className="w-full space-y-1">
            <Skeleton className="h-3.5 w-[170px]" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        </Skeleton>
      </Skeleton>
    </div>
  );
};

export default CommentSkeleton;
