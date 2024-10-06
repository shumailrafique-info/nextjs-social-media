import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
  ChannelHeaderProps,
} from "stream-chat-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
interface Props {
  open: boolean;
  openSidebar: () => void;
}

const ChatChannal = ({ open, openSidebar }: Props) => {
  return (
    <div className={cn("w-full md:block", !open && "hidden")}>
      <Channel>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

export default ChatChannal;

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

const CustomChannelHeader = ({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) => {
  return (
    <div className="flex w-full items-center gap-1 border-b border-[black]/30 py-1 dark:border-white/20">
      <div className="flex h-full w-fit items-center justify-center p-2 md:hidden">
        <Button onClick={() => openSidebar()} size={"icon"} variant={"ghost"}>
          <Menu className={"size-5"} />
        </Button>
      </div>
      <div className={"w-full"}>
        <ChannelHeader {...props} />
      </div>
    </div>
  );
};
