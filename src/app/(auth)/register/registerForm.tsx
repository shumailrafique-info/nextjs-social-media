"use client";
import * as z from "zod";
import { registerSchema } from "@/lib/validation";
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
import { register } from "@/app/(auth)/register/actions";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

interface Props {}

const RegisterForm = ({}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    setError("");
    startTransition(async () => {
      await register(values).then((res) => {
        if (res.error) {
          setError(res.error);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegisterSubmit)}
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
                  type="text"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 dark:text-white">
                Email*
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="shumaildev@gmail.com"
                  type="email"
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
              <div className="relative w-full">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    disabled={isPending}
                    placeholder="********"
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
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
