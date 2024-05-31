"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import NextAvatar from "./ui/next-avatar";
import { usePathname } from "next/navigation";
import { Message } from "@/lib/validations/message";

type ChatItemProps = {
  chatId: string;
  friendName: string;
  friendImage: string;
  lastMessageTimestamp?: string;
  lastMessageText: string;
  isLastMessageAuthor: boolean;
  isNewConversation?: boolean;
  unseenMessages?: Message[];
};

export default function ChatItem({
  chatId,
  friendName,
  friendImage,
  lastMessageTimestamp,
  lastMessageText,
  isLastMessageAuthor,
  isNewConversation = false,
  unseenMessages: initialUnseenMessages,
}: ChatItemProps) {
  const pathname = usePathname();
  const [showUnseenMessages, setShowUnseenMessages] = useState(true);

  const isSelected = useMemo(() => {
    return pathname?.includes(chatId);
  }, [chatId, pathname]);

  const lastUnseenMessage = useMemo(() => {
    if (initialUnseenMessages && initialUnseenMessages.length) {
      return initialUnseenMessages[initialUnseenMessages.length - 1];
    }
  }, [initialUnseenMessages]);

  useEffect(() => {
    const shouldNotify = pathname !== `/dashboard/chat/${chatId}`;
    setShowUnseenMessages(shouldNotify);
  }, [chatId, pathname]);

  return (
    <div
      key={chatId}
      className={cn("w-full p-3 hover:bg-accent/80", {
        "bg-accent/80": isNewConversation || showUnseenMessages,
        "bg-accent/40": isSelected,
      })}
      onClick={() => setShowUnseenMessages(false)}
    >
      <Link
        href={`/dashboard/chat/${chatId}`}
        className="w-full relative flex items-center gap-4"
      >
        <div className="flex-shrink-0">
          <NextAvatar
            alt={`${friendName} profile picture`}
            size={10}
            src={friendImage}
          />
        </div>

        <div className="grow">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-foreground">
              {friendName}
            </p>
            {lastMessageTimestamp && (
              <p className="text-xs text-muted-foreground">
                {lastMessageTimestamp}
              </p>
            )}
          </div>
          {lastUnseenMessage ? (
            <p className="text-sm w-5/6 truncate text-accent-foreground">
              {lastUnseenMessage.text}
            </p>
          ) : (
            <p className="text-sm w-5/6 truncate text-accent-foreground">
              <span className="text-muted-foreground">
                {isLastMessageAuthor ? "You: " : ""}
              </span>
              {lastMessageText}
            </p>
          )}

          {showUnseenMessages &&
          initialUnseenMessages &&
          initialUnseenMessages?.length > 0 ? (
            <div className="absolute right-0 bottom-0 w-5 h-5 rounded-full dark:bg-accent dark:text-accent-foreground bg-primary text-primary-foreground flex justify-center items-center text-xs">
              {initialUnseenMessages.length}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
