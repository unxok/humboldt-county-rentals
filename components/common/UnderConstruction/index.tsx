import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Construction } from "lucide-react";

export const UnderConstruction = () => (
  <Alert>
    <Construction className="size-4" />
    <AlertTitle>Construction Zone</AlertTitle>
    <AlertDescription>
      <p>
        This page is currently under construction, please check back again
        later!
      </p>
      <p>- Unxok</p>
    </AlertDescription>
  </Alert>
);
