import { GoBackButton } from "@/components/common/GoBackButton";

export default function Page() {
  //
  return (
    <div className="flex size-full flex-col items-center justify-center gap-2 pt-12">
      <h2 className="font-mono text-6xl font-bold tracking-wide">404</h2>
      <p>The page you requested does not exist :&#40;</p>
      <GoBackButton />
    </div>
  );
}
