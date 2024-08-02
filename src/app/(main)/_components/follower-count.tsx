"use client";
import useFollowerInfo from "@/app/hooks/use-follower-info";
import { followerInformation } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

interface Props {
  userId: string;
  initialState: followerInformation;
  className?: string;
}

const FollowerCount = ({ userId, initialState, className }: Props) => {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span className={cn("", className)}>{formatNumber(data?.followers)}</span>
  );
};

export default FollowerCount;
