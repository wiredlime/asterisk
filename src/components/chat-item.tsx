"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useMemo } from "react";
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
  unseenMessages,
}: ChatItemProps) {
  const pathname = usePathname();

  const isSelected = useMemo(() => {
    return pathname?.includes(chatId);
  }, [chatId, pathname]);

  const lastUnseenMessage = useMemo(() => {
    if (unseenMessages && unseenMessages.length) {
      return unseenMessages[unseenMessages.length - 1];
    }
  }, [unseenMessages]);
  return (
    <div
      key={chatId}
      className={cn("w-full p-3 hover:bg-accent/80", {
        "bg-accent/40": isNewConversation || unseenMessages?.length,
        "bg-accent/80": isSelected,
      })}
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
            <p className="text-base font-semibold">{friendName}</p>
            {lastMessageTimestamp && (
              <p className="text-xs text-muted-foreground">
                {lastMessageTimestamp}
              </p>
            )}
          </div>
          {lastUnseenMessage ? (
            <p className="text-sm max-w-44 truncate">
              {lastUnseenMessage.text}
            </p>
          ) : (
            <p className="text-sm max-w-44 truncate">
              <span className="text-muted-foreground">
                {isLastMessageAuthor ? "You: " : ""}
              </span>
              {lastMessageText}
            </p>
          )}

          {unseenMessages && unseenMessages.length > 0 ? (
            <div className="absolute right-0 bottom-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex justify-center items-center text-xs">
              {unseenMessages.length}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
