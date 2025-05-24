"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/common/PasswordInput";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { LoginFormSchema, LoginForm } from "@/lib/schemas";
import { useMutation } from "@/components/hooks/useMutation";
import { tryCatch } from "@/lib/utils";
import { login } from "@/lib/server-actions";

export const LoginFormCard = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: LoginForm) => {
      const res = await tryCatch(async () => login(values));
      if (res.success) return;
      toast.error(
        <>
          <div>Something went wrong</div>
          <div>{res.error}</div>
        </>,
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((form) => mutate(form))}
        className="space-y-3"
      >
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Welcome back!</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      inputProps={{
                        placeholder: "••••••••",
                        ...field,
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
              className="ml-auto"
            >
              {isPending ? <Loader2 className="animate-spin" /> : "sign in"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
