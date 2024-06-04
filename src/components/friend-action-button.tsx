"use client";
import React, { useMemo, useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loader2, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import FriendRequestActionButton from "./friend-request-action-button";
import { APP_ORIGIN } from "@/lib/constant";

interface FriendActionButtonProps extends ButtonProps {
  isFriend: boolean;
  friendEmail: string;
  onUnfriend?: VoidFunction;
  onAddFriend?: VoidFunction;
}

export default function FriendActionButton({
  isFriend: initialIsFriend,
  friendEmail,
  onUnfriend,
  onAddFriend,
  className,
}: FriendActionButtonProps) {
  const [isFriend, setIsFriend] = useState(initialIsFriend);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnfriend = async () => {
    setIsLoading(true);
    try {
      const validatedEmail = addFriendValidator.parse({ email: friendEmail });
      await axios.post(`${APP_ORIGIN}/api/friends/unfriend`, {
        email: validatedEmail,
      });
      setIsLoading(false);
      setIsFriend(false);
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
    onUnfriend?.();
  };

  return isFriend ? (
    <div className="group w-full hover:cursor-pointer">
      <Button
        className={cn(
          "group-hover:hidden w-full gap-2 text-foreground dark:border",
          className
        )}
        size="sm"
        variant="ghost"
      >
        Friend <UserCheck className="w-3 h-3" />
      </Button>
      <Button
        className={cn(
          "group-hover:flex hidden w-full gap-2 text-foreground dark:border",
          className
        )}
        size="sm"
        variant="secondary"
        onClick={handleUnfriend}
      >
        {isLoading ? (
          <Loader2 className="text-muted-foreground w-4 h-4 animate-spin" />
        ) : (
          "Unfriend"
        )}
      </Button>
    </div>
  ) : (
    <AddFriendButton
      friendEmail={friendEmail}
      isFriend={isFriend}
      onAddFriend={onAddFriend}
    />
  );
}

type AddFriendButtonProps = {
  isFriend: boolean;
  onAddFriend?: VoidFunction;
  friendEmail: string;
};
const AddFriendButton = ({
  isFriend,
  onAddFriend,
  friendEmail,
}: AddFriendButtonProps) => {
  const [friendRequestSent, setFriendRequestSent] = useState(isFriend);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFriend = async () => {
    setIsLoading(true);

    try {
      const validatedEmail = addFriendValidator.parse({ email: friendEmail });
      await axios.post(`${APP_ORIGIN}/api/friends/add`, {
        email: validatedEmail,
      });
      setIsLoading(false);
      setFriendRequestSent(true);
    } catch (error) {
      setIsLoading(false);

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

    onAddFriend?.();
  };

  const buttonState = useMemo(() => {
    if (isLoading) {
      return <Loader2 className="text-muted-foreground w-4 h-4 animate-spin" />;
    } else {
      return "Add friend";
    }
  }, [isLoading]);

  return friendRequestSent ? (
    <FriendRequestActionButton
      friendEmail={friendEmail}
      setFriendRequestSent={setFriendRequestSent}
    />
  ) : (
    <Button
      className={cn("w-full gap-2 text-foreground dark:border")}
      size="sm"
      variant="outline"
      onClick={handleAddFriend}
    >
      {buttonState}
    </Button>
  );
};
