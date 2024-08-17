"use client";
import * as z from "zod";
import { loginSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { login } from "@/app/(auth)/login/actions";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

interface Props {}

const LoginForm = ({}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    setError("");
    startTransition(async () => {
      await login(values).then((res) => {
        if (res.error) {
          setError(res.error);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLoginSubmit)}
        className="w-full space-y-2"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 dark:text-white">
                Username*
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="@shumail_dev"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 dark:text-white">
                Password*
              </FormLabel>
              <div className="relative">
                <FormControl className="relative">
                  <Input
                    disabled={isPending}
                    placeholder="********"
                    type={showPassword ? "text" : "password"}
                    className="pe-10"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide Password" : "Show Password"}
                  className="absolute right-[15px] top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOpenIcon className="h-4 w-4" />
                  ) : (
                    <EyeClosedIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-red-500">{error ?? ""}</p>
        <div className="w-full">
          <Button
            type="submit"
            disabled={isPending}
            loading={isPending}
            className="mt-2 w-full disabled:cursor-not-allowed"
          >
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
