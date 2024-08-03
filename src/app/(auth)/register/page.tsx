import RegisterForm from "@/app/(auth)/register/registerForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Register to srbook account to access your personalized dashboard and connect with like-minded individuals.",
};

interface Props {}

const Register = async ({}: Props) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-center text-2xl">
            <p className="leading-[1]">Register</p>
          </CardTitle>
          <CardDescription className="text-center">
            Start a new journey
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-1 text-[12px]">
          <p>Already have an account?</p>

          <Link href={"/login"} className="!text-[12px] hover:underline">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
