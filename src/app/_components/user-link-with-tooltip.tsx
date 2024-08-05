"use client";

import kyInstance from "@/lib/ky";
import { userData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { ReactNode } from "react";
import UserTooltip from "./user-tooltip";

interface Props {
  children: ReactNode;
  username: string;
}

const UserLinkWithToolTip = ({ children, username }: Props) => {
  const { data, isPending } = useQuery({
    queryKey: ["user-data", username],
    queryFn: async () =>
      kyInstance
        .get(`/api/users/username/${username}`)
        .json<{ success: boolean; data: { user: userData } }>(),
    retry(failtureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failtureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data || isPending || !data?.success) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data?.data?.user}>
      {
        <Link
          href={`/users/${username}`}
          className="text-primary hover:underline"
        >
          {children}
        </Link>
      }
    </UserTooltip>
  );
};

export default UserLinkWithToolTip;
