"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { commentPage, postData } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { SendHorizonal, SmilePlus } from "lucide-react";
import { useState } from "react";
import { createComment } from "./actions";

interface Props {
  post: postData;
}

const CreateComment = ({ post }: Props) => {
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async ({ data }) => {
      setInput("");

      const queryKey: QueryKey = ["comments", post.id];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<commentPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [...firstPage.comments, data.comment],
                  previousCursor: firstPage.previousCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        }
      );

      queryClient.invalidateQueries({
        queryKey: queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        variant: "default",
        description: "Comment Added!",
      });
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    mutation.mutate({
      content: input,
      post: post,
    });
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setInput((prevValue) => prevValue + emojiObject.emoji);
  };

  return (
    <div className="flex items-start justify-start gap-2">
      <form
        onSubmit={handleSubmit}
        className={`flex w-full items-center gap-2`}
      >
        <Input
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comment..."
          value={input}
          autoFocus
          className={`max-h-[42px] w-full overflow-y-auto rounded-lg border bg-gray-100 px-3 py-3 text-sm outline-none ring-0 dark:bg-black`}
        />
        <div className="relative flex items-center gap-0">
          <DropdownMenu
            open={showEmojiPicker}
            onOpenChange={setShowEmojiPicker}
          >
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="relative cursor-pointer hover:text-primary dark:text-white dark:hover:text-primary"
                disabled={mutation.isPending}
              >
                <SmilePlus />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit !p-0 shadow-lg" align="end">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type="submit"
            variant={"ghost"}
            loading={mutation.isPending}
            size={"icon"}
            className="cursor-pointer hover:text-primary dark:text-white dark:hover:text-primary"
            disabled={!input.trim() || mutation.isPending}
          >
            <SendHorizonal />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;
