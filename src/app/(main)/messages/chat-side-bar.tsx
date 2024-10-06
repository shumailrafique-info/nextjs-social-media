import {
  ChannelList,
  ChannelPreviewUIComponentProps,
  ChannelPreviewMessenger,
} from "stream-chat-react";
import { useSession } from "../_providers/session-provider";
import { Button } from "@/components/ui/button";
import { X, MailPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChatSideBar = ({ open, onClose }: Props) => {
  const { user } = useSession();

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose]
  );

  return (
    <div
      className={cn(
        "md:flex size-full flex-col border-e md:w-72",
        open ? "flex" : "hidden"
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user?.id] },
        }}
        showChannelSearch
        options={{
          state: true,
          presence: true,
          limit: 8,
        }}
        sort={{
          last_message_at: -1, // Sort by last message in descending order
        }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: { $in: [user.id] },
              },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
};

export default ChatSideBar;

interface MenuHeaderProps {
  onClose: () => void;
}

const MenuHeader = ({ onClose }: MenuHeaderProps) => {
  return (
    <div className={"flex items-center gap-3 p-2"}>
      <div className={"h-full md:hidden"}>
        <Button size={"icon"} variant={"ghost"} onClick={onClose}>
          <X className={"size-5"} />
        </Button>
      </div>
      <h1 className={"me-auto text-xl font-bold md:ms-2"}>Messages</h1>
      <Button size={"icon"} variant={"ghost"} title={"Start new chat"}>
        <MailPlus className={"size-5"} />
      </Button>
    </div>
  );
};
