import { validateRequest } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await validateRequest();

  if (session) return redirect("/");
  return (
    <div className="flex items-center justify-center md:min-h-[100vh]">
      <div className="grid w-full max-w-[850px] rounded-2xl p-5 md:grid-cols-2">
        <div className="flex flex-col items-center space-y-3 rounded-2xl p-5">
          <h1 className="w-full text-start">
            Welcome to <br />
            <Link
              href="/"
              className="font-mono text-3xl font-extrabold leading-[1]"
            >
              <span className="text-primary">SR</span>BOOK
            </Link>
          </h1>
          <p className="mt-1 w-full text-start text-sm">
            A social media website powered by <br />
            <Link
              href={"https://shumail.dev"}
              className="text-primary underline"
            >
              shumail.dev
            </Link>
          </p>
          {/* <h1 className="w-full text-start text-xl font-semibold leading-[1] text-gray-700">
            Features :
          </h1>
          <ul className="w-full list-outside list-disc pl-5 text-sm">
            <li>Users can post content.</li>
            <li>Users can follow each other.</li>
            <li>Users can like posts of eachother.</li>
            <li>Users can comment on posts of other users.</li>
            <li>Users can chat with each other.</li>
            <li>Users can create a group chat.</li>
          </ul> */}
          <p className="w-full text-start text-sm">
            Kindly post your feedback and user experience. <br />
            <Link
              href={"https://shumail.dev"}
              className="w-full text-start text-sm text-primary underline"
            >
              post a feedback
            </Link>
          </p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
