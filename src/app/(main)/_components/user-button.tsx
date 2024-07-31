"use client";

import { cn } from "@/lib/utils";
import { useSession } from "@/app/(main)/_providers/session-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import Link from "next/link";

interface Props {
  className?: string;
}

const UserButton = ({ className }: Props) => {
  const { user } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="!outline-none !ring-0">
        <button className={cn("flex items-center gap-x-2 text-foreground")}>
          <Avatar className="max-h-[35px] max-w-[35px]">
            <AvatarImage src={user.avatarUrl || ""} alt={user.displayName} />
            <AvatarFallback>SR</AvatarFallback>
          </Avatar>
          <p className="hidden sm:flex">{user?.displayName}</p>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48 max-w-[90vw]" align="end">
        <DropdownMenuLabel>@{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup asChild>
          <Link href={`/users/${user.username}`}>
            <DropdownMenuItem className="!cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="!cursor-pointer hover:!bg-red-500 hover:!text-white"
          onClick={async () => {
            await logout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
