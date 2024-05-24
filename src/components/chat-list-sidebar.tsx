"use client";
import { chatHrefConstructor } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type ChatListSidebarProps = {
  friends: User[];
  sessionId: string;
};

export interface NewMessageNotification extends Message {
  senderName: string;
  senderImage: string;
}

export default function ChatListSidebar({
  friends,
  sessionId,
}: ChatListSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);

  // Listen for new chats and newly added friends
  // useEffect(() => {
  //   pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
  //   pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

  //   const newMessageHandler = (message: NewMessageNotification) => {
  //     // Check user is already within the chat ->  no notification needed
  //     const shouldNotify =
  //       pathname !==
  //       `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

  //     if (!shouldNotify) return;
  //     // Notify using toast with a custom component
  //     toast.custom((t) => (
  //       <NewMessageToast
  //         t={t}
  //         sessionId={sessionId}
  //         senderId={message.senderId}
  //         senderImage={message.senderImage}
  //         senderName={message.senderName}
  //         message={message.text}
  //       />
  //     ));

  //     setUnseenMessages((prev) => [...prev, message]);
  //   };

  //   const newFriendHandler = (newFriend: User) => {
  //     // newFriend is the payload received from binding event 'new_friend'
  //     setActiveChats((prev) => [...prev, newFriend]);
  //   };

  //   pusherClient.bind(`new_message`, newMessageHandler);
  //   pusherClient.bind(`new_friend`, newFriendHandler);
  //   return () => {
  //     pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
  //     pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
  //     pusherClient.unbind(`new_message`, newMessageHandler);
  //     pusherClient.unbind(`new_friend`, newFriendHandler);
  //   };
  // }, [pathname, router, sessionId]);

  return (
    <div className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {activeChats.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;
        return (
          <a
            key={friend.id}
            href={`/dashboard/chat/${chatHrefConstructor(
              sessionId,
              friend.id
            )}`}
            className="hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium"
          >
            {friend.name}
            {unseenMessagesCount > 0 ? (
              <div className="bg-primary text-primary-foreground font-medium text-xs w-5 h-5 rounded-full flex justify-center items-center">
                {unseenMessagesCount}
              </div>
            ) : null}
          </a>
        );
      })}
    </div>
  );
}
