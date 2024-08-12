"use client";

import { useSession } from "@/app/(main)/_providers/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { commentPage, postData } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SendHorizonal } from "lucide-react";
import { createComment } from "./actions";

interface Props {
  post: postData;
}

const CreateComment = ({ post }: Props) => {
  //auth
  const { user } = useSession();

  //toast trigger
  const { toast } = useToast();

  //Editor Configrations
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write a comment...",
      }),
    ],
    content: "",
  });

  //Input
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  //gettting query client
  const queryClient = useQueryClient();

  //Mutation for Invalidating and creating new cache data with new comment
  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async ({ data }) => {
      editor?.commands.clearContent();
      const queryFilter = {
        queryKey: ["comments"],
        predicate(query) {
          return query.queryKey.includes("comments");
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<commentPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [data.comment, ...firstPage.comments],
                  previousCursor: firstPage.previousCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        }
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({
        variant: "default",
        description: "Comment Added successfully!",
      });
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Failed to post comment. Please try again.",
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
        <EditorContent
          editor={editor}
          className={`max-h-[42px] w-full overflow-y-auto rounded-lg border bg-gray-100 px-3 py-2.5 text-sm outline-none ring-0 dark:bg-black`}
        />
        <Button
          type="button"
          variant={"ghost"}
          loading={mutation.isPending}
          size={"icon"}
          className="hover:text-primary dark:text-white dark:hover:text-primary"
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
