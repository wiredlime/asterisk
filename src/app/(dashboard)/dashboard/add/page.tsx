import AddFriendButton from "@/components/add-friend-btn";
import FriendRequestList from "@/components/friend-request-list";
import HeaderSection from "@/components/ui/header-section";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import UserCard from "@/components/user-card";
import { UserInfoBox } from "@/components/user-info-box";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";

import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

async function Page() {
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
    <main className="h-full grid grid-cols-[4fr_8fr]">
      <div className="h-full border-r">
        <FriendRequestList
          requests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
      <div className="">
        <div className="border-b p-4 h-20 flex items-center gap-5 justify-between">
          <HeaderSection />
          <AddFriendButton />
        </div>
        <div className="p-4 space-y-4">
          <Everybody />
        </div>
      </div>
    </main>
  );
}

const Everybody = async () => {
  // Get all users
  const session = await getServerSession(authOptions);
  const result = await fetchRedis("smembers", `users`);
  const users: User[] = result
    .map((user: string) => JSON.parse(user) as User)
    .filter((user: User) => user.email !== session?.user.email);

  return (
    <>
      <p className="text-xs text-muted-foreground text-end">
        There are {users.length} friends waiting for you
      </p>
      <div className="flex flex-wrap gap-2">
        {users.map((user, index) => {
          return (
            <HoverCard key={user.id}>
              <HoverCardTrigger asChild>
                <div className="bg-accent/20 rounded-full">
                  <Image
                    referrerPolicy="no-referrer"
                    width={180}
                    height={180}
                    src={user.image || ""}
                    alt={`${user.name} profile`}
                    className="hover:cursor-pointer hover:scale-110 duration-150 rounded-full"
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent align="start" side="top" className="shadow-sm">
                <UserCard
                  email={user.email || ""}
                  isFriend={index % 2 === 0}
                  name={user.name || ""}
                  image={user.image || ""}
                  userId={user.id}
                />
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </>
  );
};

export default Page;
