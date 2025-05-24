import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "@/lib/routing";
import { getOwnUser, getOwnUsername } from "@/lib/server-only";
import { tryCatch } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { UsernameInput } from "./client";

export default async function Page() {
  const { success, data } = await tryCatch(getOwnUser());
  if (!success) {
    redirect("/not-found");
    return {} as never;
  }

  return (
    <div className="mx-auto max-w-[80ch] px-2">
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <Async user={data.user} username={data.username} />
      </Suspense>
    </div>
  );
}

const Async = (props: Awaited<ReturnType<typeof getOwnUser>>) => {
  //
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>View and edit your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <UsernameInput {...props} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
