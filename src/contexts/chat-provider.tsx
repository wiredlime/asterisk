"use client";
import { ActiveChat } from "@/components/chat-list";
import { NewMessageNotification } from "@/components/chat-list-sidebar";
import NewMessageToast from "@/components/new-message-toast";
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

interface ChatContext {
  unseenMessages: Message[];
  activeChats: ActiveChat[];
  setActiveChats?: Dispatch<SetStateAction<ActiveChat[]>>;
}
export const ChatContext = createContext<ChatContext>({
  unseenMessages: [],
  activeChats: [],
});

type ChatProviderProps = {
  sessionId: string;
  activeChats: ActiveChat[];
  children: ReactNode;
};

function ChatProvider({
  sessionId,
  activeChats: initialActiveChats,
  children,
}: ChatProviderProps) {
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
      const shouldNotifyByToast =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      setUnseenMessages((prev) => [...prev, message]);

      // Notify using toast with a custom component
      if (shouldNotifyByToast) {
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
      }
    };

    const newFriendHandler = (newFriend: User) => {
      // newFriend is the payload received from binding event 'new_friend'
      setActiveChats((prev) => [...prev, newFriend]);
    };

    pusherClient.bind(`new_friend`, newFriendHandler);
    pusherClient.bind(`new_message`, newMessageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind(`new_friend`, newFriendHandler);
      pusherClient.unbind(`new_message`, newMessageHandler);
    };
  }, [pathname, sessionId]);

  return (
    <ChatContext.Provider
      value={{ unseenMessages, setActiveChats, activeChats }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
