import FriendRequestList from "@/components/friend-request-list";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // Get user ids of incoming requests
  const incomingSenderIds = (await fetchRedis(
    `smembers`,
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  // Fetch data of every incomingSenderIds
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = JSON.parse(
        await fetchRedis("get", `user:${senderId}`)
      ) as User;
      return {
        senderId: sender.id,
        senderName: sender.name,
        senderEmail: sender.email,
        senderImage: sender.image,
      };
    })
  );

  return (
    <main className="space-y-8">
      <h2 className="text-2xl">Friend requests</h2>
      <FriendRequestList
        requests={incomingFriendRequests}
        sessionId={session.user.id}
      />
    </main>
  );
}
