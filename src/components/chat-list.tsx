import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor, cn } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ChatItem from "./chat-item";

const ChatList = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);
  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      if (lastMessageRaw) {
        const lastMessage = JSON.parse(lastMessageRaw) as Message;
        return {
          ...friend,
          lastMessage,
        };
      } else {
        return null;
      }
    })
  );

  return (
    <div className="h-full max-w-sm md:max-w-md">
      {friendsWithLastMessage.length === 0 ? (
        <EmptyState />
      ) : (
        friendsWithLastMessage.map((friend) => {
          if (friend) {
            const chatId = chatHrefConstructor(session.user.id, friend.id);
            return (
              <ChatItem
                key={chatId}
                chatId={`${chatHrefConstructor(session.user.id, friend.id)}`}
                lastMessageText={friend.lastMessage.text}
                lastMessageTimestamp={format(
                  friend.lastMessage.timestamp,
                  "HH:mm a"
                )}
                isLastMessageAuthor={
                  friend.lastMessage.senderId === session.user.id
                }
                friendName={friend.name || "N/A"}
                friendImage={friend.image || "N/A"}
              />
            );
          }
        })
      )}
    </div>
  );
};

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

export default ChatList;
