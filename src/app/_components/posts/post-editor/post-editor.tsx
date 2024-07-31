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
interface Props {}

const PostEditor = ({}: Props) => {
  const [isPending, startTransition] = useTransition();
  const { user } = useSession();
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

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const handleSubmit = async () => {
    if (!input) return;
    startTransition(async () => {
      await createPost({ content: input }).then((res) => {
        if (res?.success) {
          editor?.commands.clearContent();
        }
      });
    });
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
          loading={isPending}
          loadingText="Posting"
          className="dark:text-white"
          disabled={!input || isPending}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default PostEditor;
