import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="mx-auto max-w-[60ch] px-4 pt-24">
      <InfoCard />
    </div>
  );
}

const InfoCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Email verification required</CardTitle>
      <CardDescription>
        <p>
          Before you can log in and start doing stuff, you'll need to verify
          your email!
        </p>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p>
        Just click the link in the email sent to you by{" "}
        <b className="text-nowrap">no-reply@unxok.com</b>
      </p>
    </CardContent>
    <CardFooter>
      <p className="text-muted-foreground text-sm">
        If you don't get the email within 10 minutes, you may need to try
        signing up again.
      </p>
    </CardFooter>
  </Card>
);
