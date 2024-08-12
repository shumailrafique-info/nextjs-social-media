"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { commentPage, postData } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { createComment } from "./actions";

interface Props {
  post: postData;
}

const CreateComment = ({ post }: Props) => {
  const [input, setInput] = useState("");
  //toast trigger
  const { toast } = useToast();

  //gettting query client
  const queryClient = useQueryClient();

  //Mutation for Invalidating and creating new cache data with new comment
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

  //Submit Handler
  const handleSubmit = async () => {
    if (!input) return;
    mutation.mutate({
      content: input,
      post: post,
    });
  };

  return (
    <div className="flex items-start justify-start gap-2">
      {/* <Avatar className="max-h-[35px] min-h-[35px] min-w-[35px] max-w-[35px]">
        <AvatarImage src={user.avatarUrl || ""} alt={user.displayName} />
        <AvatarFallback>SR</AvatarFallback>
      </Avatar> */}
      <div className={`flex w-full items-center gap-2`}>
        <Input
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comment..."
          value={input}
          className={`max-h-[42px] w-full overflow-y-auto rounded-lg border bg-gray-100 px-3 py-2.5 text-sm outline-none ring-0 dark:bg-black`}
        />
        <Button
          type="button"
          variant={"ghost"}
          loading={mutation.isPending}
          size={"icon"}
          className="cursor-pointer hover:text-primary dark:text-white dark:hover:text-primary"
          disabled={!input || mutation.isPending}
          onClick={handleSubmit}
        >
          <SendHorizonal />
        </Button>
      </div>
    </div>
  );
};

export default CreateComment;
