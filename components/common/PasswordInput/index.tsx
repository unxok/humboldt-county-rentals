import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import { ComponentProps, useState } from "react";

export const PasswordInput = ({
  divProps,
  inputProps,
  buttonProps,
}: {
  divProps?: ComponentProps<"div">;
  inputProps?: Omit<ComponentProps<typeof Input>, "type">;
  buttonProps?: Omit<ComponentProps<typeof Button>, "variant" | "onClick">;
}) => {
  const [isVisible, setVisible] = useState(false);
  const { className: divClassName, ...restDivProps } = divProps ?? {};

  return (
    <div className={cn("flex", divClassName)} {...restDivProps}>
      <Input type={isVisible ? "text" : "password"} {...inputProps} />
      <Button
        variant={"ghost"}
        onClick={() => setVisible((prev) => !prev)}
        type="button"
        {...buttonProps}
      >
        {isVisible ? <Eye /> : <EyeClosed />}
      </Button>
    </div>
  );
};
