"use client";

import { useMutation } from "@/components/hooks/useMutation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendSignupOtp, verifyOtp } from "@/lib/server-actions";
import { EmailOtpType } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const OtpFormCard = ({
  title,
  description,
  email,
  type,
}: {
  title: string;
  description: string;
  email: string;
  type: EmailOtpType;
}) => {
  const [token, setToken] = useState("");
  const resend = useMutation({
    mutationFn: async (...args: Parameters<typeof resendSignupOtp>) =>
      await resendSignupOtp(...args),
    onSuccess: () => {
      toast.success(
        <>
          <div>New code sent</div>
          <div>Please wait at least 5 minutes before sending another</div>
        </>,
      );
    },
    onError: (e) => {
      toast.error(
        <>
          <div>Something went wrong</div>
          <div>
            {e instanceof Error
              ? e.message
              : typeof e === "string"
                ? e
                : "Unknown error"}
          </div>
        </>,
      );
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async (...args: Parameters<typeof verifyOtp>) =>
      verifyOtp(...args),
    onError: (e) => {
      toast.error(
        <>
          <div>Something went wrong</div>
          <div>
            {e instanceof Error
              ? e.message
              : typeof e === "string"
                ? e
                : "Unknown error"}
          </div>
        </>,
      );
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          aria-label="otp-input"
          placeholder="6 digit code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <div className="text-muted-foreground text-sm">
          Didn't get the code within 5 minutes?{" "}
          <Button
            variant={"link"}
            className="p-0"
            onClick={async () => resend.mutate({ email, type: "signup" })}
          >
            {resend.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Resend it"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="ml-auto"
          disabled={isPending || token.length < 6}
          onClick={() => mutate({ email, token, type })}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "verify"}
        </Button>
      </CardFooter>
    </Card>
  );
};
