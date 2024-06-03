"use client";

import { chatHrefConstructor, cn } from "@/lib/utils";
import React from "react";
import toast, { Toast } from "react-hot-toast";
import NextAvatar from "./ui/next-avatar";
import { Button } from "./ui/button";
import { X } from "lucide-react";
type NewMessageToastProps = {
  t: Toast;
  sessionId: string;
  senderId: string;
  senderImage: string;
  senderName: string;
  message: string;
};

function NewMessageToast({
  t,
  sessionId,
  senderId,
  senderImage,
  senderName,
  message,
}: NewMessageToastProps) {
  return (
    <div
      className={cn(
        "max-w-md min-w-[300px] backdrop-blur-lg shadow-md rounded-2xl p-3",
        "flex justify-between",
        {
          "animate-enter": t.visible,
          "animate-leave": !t.visible,
        }
      )}
    >
      <a
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
        className="grow"
      >
        <div className="grow flex items-start gap-2">
          <div className="flex-shrink-0">
            <NextAvatar
              src={senderImage}
              alt={`${senderName} profile picture`}
              size={10}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-foreground">{senderName}</p>
            <p className="text-xs text-muted-foreground line-clamp-3">
              {message}
            </p>
          </div>
        </div>
      </a>
      <Button
        variant="ghost"
        onClick={() => toast.dismiss(t.id)}
        className="hover:bg-accent/20 px-0 h-0"
      >
        <X className="w-5 h-5 text-muted-foreground/40" />
      </Button>
    </div>
  );
}

export default NewMessageToast;
