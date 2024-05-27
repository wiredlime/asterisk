"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { z } from "zod";
import toast from "react-hot-toast";

type FriendRequestActionButtonProps = {
  setFriendRequestSent: React.Dispatch<React.SetStateAction<boolean>>;
  friendEmail: string;
};

export default function FriendRequestActionButton({
  setFriendRequestSent,
  friendEmail,
}: FriendRequestActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelRequest = async () => {
    setIsLoading(true);
    try {
      const validatedEmail = addFriendValidator.parse({ email: friendEmail });
      await axios.post("/api/friends/cancel-add", { email: validatedEmail });

      setIsLoading(false);
      setFriendRequestSent(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.message);
        return;
      }
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
        return;
      }
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="group w-full">
      <Button
        className={cn("group-hover:hidden w-full gap-2")}
        size="sm"
        variant="ghost"
      >
        {isLoading ? (
          <Loader2 className="text-muted-foreground w-4 h-4 animate-spin" />
        ) : (
          <>
            Request sent <Check className="w-4 h-4" />
          </>
        )}
      </Button>
      <Button
        className={cn("group-hover:flex hidden w-full gap-2")}
        size="sm"
        variant="secondary"
        onClick={handleCancelRequest}
      >
        Cancel request
      </Button>
    </div>
  );
}
