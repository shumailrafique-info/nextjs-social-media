import { useSession } from "@/app/(main)/_providers/session-provider";
import kyInstance from "@/lib/ky";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export default function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: user.id,
          name: user.displayName,
          username: user.username,
          image: user.avatarUrl,
        },
        async () =>
          kyInstance
            .get("/api/get-token")
            .json<{
              success: boolean;
              data: { token: string };
            }>()
            .then((res) => res?.data?.token)
      )
      .catch((err) => {
        console.error("Failed to connect to Stream Chat", err);
      })
      .then(() => {
        setChatClient(client);
      });

    return () => {
      setChatClient(null);
      if (client) {
        client
          .disconnectUser()
          .catch((err) =>
            console.log(`failed to disconnect stream chat client: ${err}`)
          );
      }
    };
  }, [user?.id, user?.displayName, user?.avatarUrl, user?.username]);
  return chatClient;
}
