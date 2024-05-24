"use client";

import { chatHrefConstructor, cn, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import ChatItem from "./chat-item";
import { NewMessageNotification } from "./chat-list-sidebar";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NewMessageToast from "./new-message-toast";

export interface ActiveChat extends User {
  lastMessage?: Message;
}

type ChatListProps = {
  activeChats: ActiveChat[];
  sessionId: string;
};

const ChatList = ({
  activeChats: initialActiveChats,
  sessionId,
}: ChatListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] =
    useState<ActiveChat[]>(initialActiveChats);

  // Listen for new chats and newly added friends
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newMessageHandler = (message: NewMessageNotification) => {
      // Check user is already within the chat ->  no notification needed
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;
      // Notify using toast with a custom component
      toast.custom((t) => (
        <NewMessageToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImage={message.senderImage}
          senderName={message.senderName}
          message={message.text}
        />
      ));

      setUnseenMessages((prev) => [...prev, message]);
    };

    const newFriendHandler = (newFriend: User) => {
      // newFriend is the payload received from binding event 'new_friend'
      setActiveChats((prev) => [...prev, newFriend]);
    };

    pusherClient.bind(`new_message`, newMessageHandler);
    pusherClient.bind(`new_friend`, newFriendHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind(`new_message`, newMessageHandler);
      pusherClient.unbind(`new_friend`, newFriendHandler);
    };
  }, [pathname, router, sessionId]);

  return (
    <div className="h-full w-full">
      {activeChats.length === 0 ? (
        <EmptyState />
      ) : (
        activeChats.map((friend) => {
          const myUnseenMessages = unseenMessages.filter((unseenMsg) => {
            return unseenMsg.senderId === friend.id;
          });

          if (friend.lastMessage) {
            const chatId = chatHrefConstructor(sessionId, friend.id);
            return (
              <ChatItem
                key={chatId}
                chatId={`${chatHrefConstructor(sessionId, friend.id)}`}
                lastMessageText={friend.lastMessage.text}
                lastMessageTimestamp={format(
                  friend.lastMessage.timestamp,
                  "HH:mm a"
                )}
                isLastMessageAuthor={friend.lastMessage.senderId === sessionId}
                friendName={friend.name || "N/A"}
                friendImage={friend.image || "N/A"}
                unseenMessages={myUnseenMessages}
              />
            );
          } else if (!friend.lastMessage) {
            return (
              <ChatItem
                key={friend.id}
                chatId={`${chatHrefConstructor(sessionId, friend.id)}`}
                lastMessageText={"Lets start a new conversation"}
                isLastMessageAuthor={false}
                friendName={friend.name || "N/A"}
                isNewConversation={true}
                friendImage={friend.image || "N/A"}
                unseenMessages={myUnseenMessages}
              />
            );
          }
        })
      )}
    </div>
  );
};

export default ChatList;

// TODO: Make component reusable
export const EmptyState = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-0">
      <div className="relative w-60 h-60">
        <Image
          fill
          alt="Empty state"
          src="https://illustrations.popsy.co/white/online-dating.svg"
        />
      </div>
      <p className="italic text-muted-foreground">
        Click on your favorite person to start chatting!
      </p>
    </div>
  );
};
