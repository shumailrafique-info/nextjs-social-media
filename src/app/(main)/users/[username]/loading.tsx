import { Loader2 } from "lucide-react";

interface Props {}

const Loading = ({}: Props) => {
  return <Loader2 className="mx-auto my-3 animate-spin" />;
};

export default Loading;
