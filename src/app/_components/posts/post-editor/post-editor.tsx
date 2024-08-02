"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { createPost } from "./actions";
import { useTransition } from "react";
import { useSession } from "@/app/(main)/_providers/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { PostPage } from "@/app/(main)/_components/for-you-posts";
import { postData } from "@/lib/types";

interface Props {}

const PostEditor = ({}: Props) => {
  //auth
  const { user } = useSession();

  //Editor Configrations
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's in your mind ?",
      }),
    ],
    content: "",
  });

  //Input
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  //toast trigger
  const { toast } = useToast();

  //gettting query client
  const queryClient = useQueryClient();

  //Mutation for Invalidating and creating new cache data with new post
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: async ({ newPost }) => {
      editor?.commands.clearContent();

      const queryFilter: QueryFilters = {
        queryKey: ["posts", "for-you"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
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
          return !query.state.data;
        },
      });

      toast({
        variant: "default",
        description: "Post created successfully!",
      });
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Failed to create post. Please try again.",
      });
    },
  });

  //Submit Handler
  const handleSubmit = async () => {
    if (!input) return;
    mutation.mutate({ content: input });
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-md dark:border">
      <div className="flex items-start justify-start gap-3">
        <Avatar className="max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px]">
          <AvatarImage src={user.avatarUrl || ""} alt={user.displayName} />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-lg border bg-gray-100 px-4 py-2.5 text-sm outline-none ring-0 dark:bg-black"
        />
      </div>
      <div className="flex w-full justify-end">
        <Button
          type="button"
          loading={mutation.isPending}
          loadingText="Posting"
          className="dark:text-white"
          disabled={!input || mutation.isPending}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default PostEditor;
