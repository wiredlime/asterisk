import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Message,
  messageListValidator,
  messageValidator,
} from "@/lib/validations/message";
import { timeStamp } from "console";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";
import { z } from "zod";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { text, chatId } = await req.json();

    const session = await getServerSession(authOptions);

    // Check for authorized requests
    if (!session) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Check if partnerId belong to the friend list
    const partnerId = session.user.id === userId1 ? userId2 : userId1;

    const isFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      partnerId
    )) as boolean;
    if (!isFriend) {
      return new Response("Can only send message to friends", { status: 401 });
    }

    const sender = JSON.parse(
      await fetchRedis("get", `user:${session.user.id}`)
    ) as User;

    // All valid - Send the message & Make realtime event trigger:
    // 1. notify the person that's receiving the msg in realtime
    // 2. write that msg to db
    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };
    const message = messageValidator.parse(messageData);

    // Notify all connected chat room clients - is listened in private room
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming_message",
      message
    );

    // Trigger a central new_message event that announce new messages in any chat - is listen all around the app
    await pusherServer.trigger(
      toPusherKey(`user:${partnerId}:chats`),
      "new_message",
      { ...message, senderImage: sender.image, senderName: sender.name }
    );

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("OK");
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
