"use client";

import { cn, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import React, { useEffect, useRef, useState } from "react";
import NextAvatar from "./ui/next-avatar";
import { format } from "date-fns";
import { pusherClient } from "@/lib/pusher";

type MessagesProps = {
  initialMessages: Message[];
  sessionId: string;
  chatPartner: User;
  chatId: string;
};

// 1. Make sure to flex-col-reverse to reverse to messages
// 2. Whenever a message is sent, we want to automatically scroll to that message -> using the scrollDownRef
// 3. Using a local state, so that when a user send a message, we could immediately show it to them by setting state
// 4. Calculating to show profile picture at the last message of a series: hasNextMessageFromSameUser
// 5. Displaying my message on the right side, partner message on the left side

function Messages({
  initialMessages,
  sessionId,
  chatPartner,
  chatId,
}: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  // Listen to chat event
  // 1. Subscribe
  // 2. Bind event to an event handler
  // 3. Clean up
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const incomingMessageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]); // add new message to the start of the array
    };
    pusherClient.bind("incoming_message", incomingMessageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming_message", incomingMessageHandler);
    };
  }, [chatId]);
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-1 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}></div>
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;
        const time = format(new Date(message.timestamp), "HH:mm a");

        const avatar = !isCurrentUser ? (chatPartner.image as string) : "";

        return (
          <div
            key={message.id + message.timestamp}
            className="chat-message" // for debugging
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn("flex flex-row max-w-xs mx-2", {
                  "order-1 items-end": isCurrentUser,
                  "order-2 items-start": !isCurrentUser,
                })}
              >
                <span
                  className={cn(
                    "px-4 py-2 rounded-2xl flex items-center gap-2",
                    {
                      "bg-accent text-primary": !isCurrentUser,
                      "bg-primary text-primary-foreground": isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                      "flex flex-row-reverse": isCurrentUser,
                    }
                  )}
                >
                  {message.text}
                  <span className="text-xs text-muted-foreground">{time}</span>
                </span>
              </div>

              {isCurrentUser ? null : (
                <div
                  className={cn({
                    "order-2": isCurrentUser,
                    "order-1": !isCurrentUser,
                    invisible: hasNextMessageFromSameUser,
                  })}
                >
                  <NextAvatar
                    alt={`${chatPartner.name} profile`}
                    src={avatar}
                    size={5}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Messages;
