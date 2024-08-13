"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import DeleteCommentDialog from "./delete-comment-dialog";

interface Props {
  postId: string;
  commentId: string;
}

const MoreOptionsComment = ({ postId, commentId }: Props) => {
  const [openDeleteDianlog, setOpenDeleteDianlog] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <EllipsisIcon className="size-[17px] opacity-80" />
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
      <DeleteCommentDialog
        open={openDeleteDianlog}
        onClose={() => setOpenDeleteDianlog(false)}
        postId={postId}
        commentId={commentId}
      />
    </>
  );
};

export default MoreOptionsComment;
