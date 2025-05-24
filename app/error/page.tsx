import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ERROR_SEARCH_PARAM, RETURN_URL_SEARCH_PARAM } from "@/lib/constants";
import { SearchParams } from "next/dist/server/request/search-params";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const description =
    sp?.[ERROR_SEARCH_PARAM]?.toString() ??
    "An unknown error occurred! Please reach out for assistance.";
  const returnUrl = sp?.[RETURN_URL_SEARCH_PARAM]?.toString() ?? "/";

  return (
    <div className="mx-auto w-full max-w-[95%]">
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-4xl font-semibold">
            Something went wrong :&#40;
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href={returnUrl}
            className={buttonVariants({ variant: "default" })}
          >
            Go back
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
