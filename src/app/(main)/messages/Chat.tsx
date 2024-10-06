"use client";

import useInitializeChatClient from "@/app/(main)/messages/useInitializeChatClient";
import { Loader2 } from "lucide-react";
import { Chat as StreamChat } from "stream-chat-react";
import ChatSideBar from "./chat-side-bar";
import ChatChannal from "./chat-channal";
import { useTheme } from "next-themes";
import { useState } from "react";
interface Props {}

const Chat = ({}: Props) => {
  const chatClient = useInitializeChatClient();

  const { resolvedTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!chatClient) return;
  <Loader2 className="mx-auto animate-spin" />;

  return (
    <main className="relative h-full overflow-hidden rounded-xl bg-card text-center shadow-md dark:border">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
          client={chatClient}
        >
          <ChatSideBar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannal
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
};

export default Chat;
