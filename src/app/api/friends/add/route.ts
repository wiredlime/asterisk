import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";

// 1. Add friend to user's friend set
// 2. Trigger the incoming_friend_requests realtime event (as this route is called every time a friend request is sent)

export async function POST(req: Request) {
  // Interacting with the database
  try {
    const body = await req.json();

    // Re-validate data from the client
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // Fetching the userId using the email, rmb to provide authorized headers
    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    // Throw if user doesn't exist
    if (!idToAdd) {
      return new Response("User does not exist", { status: 400 });
    }

    // Verify the request sender
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Check if request sender is adding themselves
    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    // Check if target user is already added (request sent)
    const isAdded: boolean = await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    );

    if (isAdded) {
      return new Response("Already added this user.", { status: 400 });
    }

    // Check if target user is already friends
    const isFriend: boolean = await fetchRedis(
      "sismember",
      `user:${idToAdd}:friends`,
      idToAdd
    );

    if (isFriend) {
      return new Response("Already is friend with this user.", { status: 400 });
    }

    // Valid request --> send friend request
    // Trigger an event to notify the idToAdd user
    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests", // event name
      {
        senderId: session.user.id, // payload
        senderEmail: session.user.email,
        senderName: session.user.name,
        senderImage: session.user.image,
      }
    );
    // Add to database
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id); // add perform use id to the incoming_friend_requests list of target user
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Invalid request", { status: 400 });
  }
}
