"use client";

import { useDebouncer } from "@/components/hooks/useDebounced";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getOwnUser } from "@/lib/server-only";
import { Check, CheckCircle2, Loader2, Pen, X } from "lucide-react";
import { useState } from "react";

type UserInfo = Awaited<ReturnType<typeof getOwnUser>>;
type Status = "pending" | "taken" | "available";

export const UsernameInput = ({ user, username }: UserInfo) => {
  const [newUsername, setNewUsername] = useState(username);
  const [isEditing, setIsEditing] = useState(false);
  // const [status, setStatus] = useState<Status>("available");

  const {
    debouncedValue: status,
    debounceFn: checkUsernameAvailable,
    isPending,
  } = useDebouncer<string, Status>({
    fn: async (un) => {
      await new Promise((res) => window.setTimeout(res, 1000));
      return "taken";
    },
    delayMs: 500,
    initialValue: "available",
  });

  return (
    <form className="flex flex-col gap-1">
      <Label htmlFor="username" className="pb-1">
        Username
      </Label>
      <div className="flex items-center gap-1">
        <Input
          id="username"
          type="text"
          disabled={!isEditing}
          value={newUsername}
          onChange={(e) => {
            setNewUsername(e.target.value);
            checkUsernameAvailable(e.target.value);
          }}
        />
        {!isEditing && (
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setIsEditing(true)}
          >
            <Pen />
          </Button>
        )}
        {isEditing && (
          <div className="flex gap-0.5">
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => {
                setNewUsername(username);
                setIsEditing(false);
              }}
            >
              <X />
            </Button>
            <Button
              size={"icon"}
              onClick={() => {
                setIsEditing(false);
              }}
            >
              <Check />
            </Button>
          </div>
        )}
      </div>
      {isEditing && newUsername !== username && (
        <StatusIndicator s={isPending ? "pending" : status} />
      )}
    </form>
  );
};

const StatusIndicator = ({ s }: { s: Status }) => (
  <p className="pl-2 text-sm">
    {s === "pending" && <Loader2 className="animate-spin" />}
    {s === "available" && <span>available</span>}
    {s === "taken" && <span>taken</span>}
  </p>
);
