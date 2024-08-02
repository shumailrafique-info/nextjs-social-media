import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="my-12 flex h-fit w-full flex-col items-center justify-center space-y-3 text-center">
      <h1 className="text-3xl font-bold">Not Found</h1>
      <p>The page you are looking for does not exit.</p>
      <Button asChild>
        <Link href={"/"}>Back to home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
