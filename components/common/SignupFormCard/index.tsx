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
  FormDescription,
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
import { useMutation } from "@/components/hooks/useMutation";
import { tryCatch } from "@/lib/utils";
import { SignupForm, SignupFormSchema } from "@/lib/schemas";
import { signup } from "@/lib/server-actions";

export const SignupFormCard = () => {
  const form = useForm<SignupForm>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: SignupForm) => {
      const result = await tryCatch(async () => await signup(values));
      if (result.success) return;
      toast.error(
        <>
          <div>Something went wrong</div>
          <div>{result.error}</div>
        </>,
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (form) => {
          mutate(form);
        })}
        className="space-y-3"
      >
        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              With an account, you can leave comments, submit reviews, and get
              notifications on new rentals!
            </CardDescription>
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
                  <FormDescription>
                    Will not be shown to other users
                  </FormDescription>
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
                  <FormDescription>
                    A{" "}
                    <a
                      className="text-primary underline"
                      href="https://bitwarden.com/password-generator/#password-generator"
                      target="_blank"
                    >
                      strong password
                    </a>{" "}
                    is recommended
                  </FormDescription>
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
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "create account"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
