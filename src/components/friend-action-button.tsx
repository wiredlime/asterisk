"use client";
import React, { useMemo, useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import FriendRequestActionButton from "./friend-request-action-button";

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

  const handleUnfriend = async () => {
    try {
      const validatedEmail = addFriendValidator.parse({ email: friendEmail });
      await axios.post("/api/friends/unfriend", { email: validatedEmail });
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
    <div className="group w-full">
      <Button
        className={cn("group-hover:hidden w-full gap-2", className)}
        size="sm"
        variant="ghost"
      >
        Friend <UserCheck className="w-3 h-3" />
      </Button>
      <Button
        className={cn("group-hover:flex hidden w-full gap-2", className)}
        size="sm"
        variant="secondary"
        onClick={handleUnfriend}
      >
        Unfriend
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

  const handleAddFriend = async () => {
    try {
      const validatedEmail = addFriendValidator.parse({ email: friendEmail });
      await axios.post("/api/friends/add", { email: validatedEmail });
      setFriendRequestSent(true);
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

    onAddFriend?.();
  };

  return friendRequestSent ? (
    <FriendRequestActionButton
      friendEmail={friendEmail}
      setFriendRequestSent={setFriendRequestSent}
    />
  ) : (
    <Button
      className={cn("w-full gap-2")}
      size="sm"
      variant="outline"
      onClick={handleAddFriend}
    >
      Add friend
    </Button>
  );
};
