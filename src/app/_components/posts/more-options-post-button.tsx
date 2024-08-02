"use client";

import { postData } from "@/lib/types";
import DeletePostDialog from "./post-delete/delete-post-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { MoreHorizontal, MoreVertical } from "lucide-react";

interface Props {
  post: postData;
  className?: string;
}

const MoreOptionPostButton = ({ post }: Props) => {
  const [openDeleteDianlog, setOpenDeleteDianlog] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <MoreVertical className="size-[19px] opacity-80" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setOpenDeleteDianlog(true)}
              className="!cursor-pointer"
            >
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Post Delete Dianlog  */}
      <DeletePostDialog
        open={openDeleteDianlog}
        onClose={() => setOpenDeleteDianlog(false)}
        post={post}
      />
    </>
  );
};

export default MoreOptionPostButton;
