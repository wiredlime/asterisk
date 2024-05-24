import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToCancelRequest } = addFriendValidator.parse(
      body.email
    ); // Add & cancel & unfriend uses the same validator

    const userIdToCancel = (await fetchRedis(
      "get",
      `user:email:${emailToCancelRequest}`
    )) as string;

    // Throw if user doesn't exist
    if (!userIdToCancel) {
      return new Response("User does not exist", { status: 400 });
    }

    // Verify the request sender
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Trigger event to notify userIdToCancel (that they are losing 1 request)
    await pusherServer.trigger(
      toPusherKey(`user:${userIdToCancel}:incoming_friend_requests`),
      "incoming_friend_requests", // event name
      {
        senderId: session.user.id, // payload
        senderEmail: session.user.email,
        senderName: session.user.name,
        senderImage: session.user.image,
      }
    );

    // Remove the request in db
    await db.srem(
      `user:${session.user.id}:incoming_friend_requests`,
      userIdToCancel
    );

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Invalid request", { status: 400 });
  }
}
