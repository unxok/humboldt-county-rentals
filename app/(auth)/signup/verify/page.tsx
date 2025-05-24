import { OtpFormCard } from "@/components/common/OtpFormCard";
import { redirect } from "@/lib/routing";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { email } = sp;

  if (!email || Array.isArray(email)) redirect("/login");

  return (
    typeof email === "string" && (
      <div className="mx-auto max-w-[60ch] px-4 pt-24">
        <OtpFormCard
          title="Verify email"
          description="To complete registration, check your email and enter the code below"
          email={email}
          type="signup"
        />
      </div>
    )
  );
}
