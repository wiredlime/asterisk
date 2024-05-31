import AddFriendButton from "@/components/add-friend-btn";
import FriendRequestList from "@/components/friend-request-list";
import HeaderSection from "@/components/ui/header-section";

import UserCard from "@/components/user-card";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { uniqBy } from "lodash";

import { getServerSession } from "next-auth";
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
    <main className=" h-full grid grid-cols-[4fr_8fr]">
      <div className="h-full border-r">
        <FriendRequestList
          requests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
      <div className="">
        <div className="border-b p-4 h-20 flex items-center gap-5 justify-between">
          <HeaderSection
            header="Meet everybody"
            subheader="Browse, talk and add everybody on the app here"
          />
          <AddFriendButton />
        </div>
        <Everybody />
      </div>
    </main>
  );
}

const Everybody = async () => {
  // Get all users
  const session = await getServerSession(authOptions);
  const result = await fetchRedis("smembers", `users`);
  const users: User[] = uniqBy(
    result
      .map((user: string) => JSON.parse(user) as User)
      .filter((user: User) => user.email !== session?.user.email),
    (user) => {
      return user.email;
    }
  );

  return (
    <div className="p-4 relative space-y-4">
      <p className="text-xs text-muted-foreground text-end">
        There are {users.length} friends waiting for you
      </p>
      <div className="absolute top-8 h-20 w-full bg-gradient-to-t from-transparent gay:hidden dark:to-black midnight:to-black to-white to-100% z-20"></div>
      <div className="py-8 flex flex-wrap gap-4 no-scrollbar overflow-y-scroll overflow-x-hidden h-[780px]">
        {users.map((user, index) => {
          return (
            <UserCard
              key={user.id}
              name={user.name || ""}
              image={user.image || ""}
              email={user.email || ""}
              isFriend={false}
            />
          );
        })}
        <div className="w-[223px] h-[257px]"></div>
      </div>
    </div>
  );
};

export default Page;
