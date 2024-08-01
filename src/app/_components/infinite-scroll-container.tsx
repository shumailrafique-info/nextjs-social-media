import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
interface Props {
  onBottomReached: () => void;
  className?: string;
  children: React.ReactNode;
}

const InfiniteScrollContainer = ({
  className,
  onBottomReached,
  children,
}: Props) => {
  const { ref } = useInView({
    rootMargin: "150px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });
  return (
    <div className={cn("", className)}>
      {children}
      <div ref={ref} />
    </div>
  );
};

export default InfiniteScrollContainer;
