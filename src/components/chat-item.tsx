"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useMemo } from "react";
import NextAvatar from "./ui/next-avatar";
import { usePathname } from "next/navigation";

type ChatItemProps = {
  chatId: string;
  friendName: string;
  friendImage: string;
  lastMessageTimestamp?: string;
  lastMessageText: string;
  isLastMessageAuthor: boolean;
  isNewConversation?: boolean;
};

export default function ChatItem({
  chatId,
  friendName,
  friendImage,
  lastMessageTimestamp,
  lastMessageText,
  isLastMessageAuthor,
  isNewConversation = false,
}: ChatItemProps) {
  const pathname = usePathname();

  const isSelected = useMemo(() => {
    return pathname?.includes(chatId);
  }, [chatId, pathname]);

  return (
    <div
      key={chatId}
      className={cn("p-3 hover:bg-accent/80", {
        "bg-accent/80": isSelected || isNewConversation,
        // "bg-indigo-50/50": isNewConversation,
      })}
    >
      <Link
        href={`/dashboard/chat/${chatId}`}
        className="relative flex items-center gap-4"
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
          <p className="text-sm max-w-72 truncate">
            <span className="text-muted-foreground">
              {isLastMessageAuthor ? "You: " : ""}
            </span>
            {lastMessageText}
          </p>

          {!isNewConversation && (
            <div className="absolute right-0 bottom-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex justify-center items-center text-xs">
              1
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
