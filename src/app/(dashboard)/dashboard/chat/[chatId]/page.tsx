import ChatInput from "@/components/chat-input";
import Messages from "@/components/messages";
import NextAvatar from "@/components/ui/next-avatar";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Message, messageListValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

type PageProps = {
  params: {
    chatId: string;
  };
};

const getChatMessages = async (chatId: string) => {
  try {
    const results: string[] = await fetchRedis(
      `zrange`, // zrange for sorted array
      `chat:${chatId}:messages`,
      0, // start index
      -1 // end index
    );
    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.reverse();
    const messages = messageListValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
};

// TODO: create chat instance that store list of participants, instead of 2 participants on the ID
// For group chat
export default async function Page({ params }: PageProps) {
  const { chatId } = params;
  const session = await getServerSession(authOptions);

  if (!session) notFound();
  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }
  const partnerId = user.id === userId1 ? userId2 : userId1;
  const partner = (await db.get(`user:${partnerId}`)) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh)]">
      <div className="flex sm:items-center justify-between p-2 px-4 border-b border-gray-200">
        <div className="relative flex items-center gap-4">
          <NextAvatar
            fill
            size={10}
            referrerPolicy="no-referrer"
            src={partner.image || ""}
            alt={`${partner.name} profile picture`}
          />

          <div className="flex flex-col leading-tight">
            <div className="text-base flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {partner.name}
              </span>
            </div>

            <span className="text-xs text-gray-600">{partner.email}</span>
          </div>
        </div>
      </div>
      <Messages
        initialMessages={initialMessages}
        sessionId={session.user.id}
        chatPartner={partner}
        chatId={chatId}
      />
      <ChatInput chatId={chatId} chatPartner={partner} />
    </div>
  );
}
