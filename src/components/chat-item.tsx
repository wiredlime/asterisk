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
  lastMessageTimestamp: string;
  lastMessageText: string;
  isLastMessageAuthor: boolean;
};

export default function ChatItem({
  chatId,
  friendName,
  friendImage,
  lastMessageTimestamp,
  lastMessageText,
  isLastMessageAuthor,
}: ChatItemProps) {
  const pathname = usePathname();

  const isSelected = useMemo(() => {
    return pathname?.includes(chatId);
  }, [chatId, pathname]);

  return (
    <div
      key={chatId}
      className={cn("p-3 hover:bg-accent/80", {
        "bg-accent/80": isSelected,
      })}
    >
      <Link
        href={`/dashboard/chat/${chatId}`}
        className="flex items-center gap-4"
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
            <p className="text-sm text-muted-foreground">
              {lastMessageTimestamp}
            </p>
          </div>
          <p className="text-sm max-w-72 truncate">
            <span className="text-muted-foreground">
              {isLastMessageAuthor ? "You: " : ""}
            </span>
            {lastMessageText}
          </p>
        </div>
      </Link>
    </div>
  );
}
