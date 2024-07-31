"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {}

const SearchBox = ({}: Props) => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim() || "";
    if (!q) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      method={"GET"}
      action={"/search"}
      className="relative"
    >
      <Input
        type="text"
        name="q"
        placeholder="Search here..."
        className="max-h-[34px] bg-gray-100 pr-[35px] dark:bg-black"
      />
      <button
        type="submit"
        className="absolute right-[8px] top-1/2 -translate-y-1/2 cursor-pointer"
      >
        <Search className="size-[20px] text-primary" />
      </button>
    </form>
  );
};

export default SearchBox;
