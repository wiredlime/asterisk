"use client";
import { chatHrefConstructor } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import Image from "next/image";
import { format } from "date-fns";
import ChatItem from "./chat-item";
import { useContext } from "react";

import { Input } from "./ui/input";
import { Search, SquarePen } from "lucide-react";
import NewMessageForm from "./new-message-form";
import { Button } from "./ui/button";
import { SearchFriendFormData, SearchFriendFormSchema } from "./friend-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChatContext } from "@/contexts/chat-provider";

export interface ActiveChat extends User {
  lastMessage?: Message;
}

type ChatListProps = {
  activeChats: ActiveChat[];
  sessionId: string;
  friends: User[];
};

const ChatList = ({
  activeChats: initialActiveChats,
  sessionId,
  friends,
}: ChatListProps) => {
  const { unseenMessages, activeChats, setActiveChats } =
    useContext(ChatContext);
  const { register, handleSubmit } = useForm<SearchFriendFormData>({
    resolver: zodResolver(SearchFriendFormSchema),
  });

  const onSubmit = (data: SearchFriendFormData) => {
    const filteredChats = initialActiveChats.filter((friend) => {
      if (friend.name?.toLowerCase().includes(data.name.toLowerCase())) {
        return true;
      }
    });
    setActiveChats?.(filteredChats);
  };

  return (
    <div className="w-full h-full">
      <div className="border-b p-4 h-20 flex items-center justify-between">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <Input
            placeholder="Search friends..."
            {...register("name")}
            name="name"
            startAdornment={<Search className="w-4 h-4" />}
          />
        </form>
        <NewMessageForm
          sessionId={sessionId || ""}
          friends={friends}
          formTrigger={
            <Button variant="ghost" className="px-0 ml-4 h-0">
              <SquarePen className="w-5 h-5" />
            </Button>
          }
        />
      </div>
      <div className="w-full">
        {activeChats.length === 0 ? (
          <div className="grid place-items-center p-4 py-10">
            <p className="text-muted-foreground text-center">
              You have no friends yet, let&apos;s add some
            </p>
          </div>
        ) : (
          activeChats.map((friend) => {
            const eachFriendUnseenMessages = unseenMessages.filter(
              (unseenMsg) => {
                return (
                  unseenMsg.senderId === friend.id ||
                  unseenMsg.senderId === sessionId
                );
              }
            );

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
                  isLastMessageAuthor={
                    friend.lastMessage.senderId === sessionId
                  }
                  friendName={friend.name || "N/A"}
                  friendImage={friend.image || "N/A"}
                  unseenMessages={eachFriendUnseenMessages}
                />
              );
            } else if (!friend.lastMessage) {
              return (
                <ChatItem
                  key={friend.id}
                  chatId={`${chatHrefConstructor(sessionId, friend.id)}`}
                  lastMessageText={"Let's start a new conversation"}
                  isLastMessageAuthor={false}
                  friendName={friend.name || "N/A"}
                  isNewConversation={true}
                  friendImage={friend.image || "N/A"}
                  unseenMessages={eachFriendUnseenMessages}
                />
              );
            }
          })
        )}
      </div>
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
