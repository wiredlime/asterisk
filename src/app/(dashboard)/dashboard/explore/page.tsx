import FriendList from "@/components/friend-list";
import HeaderSection from "@/components/ui/header-section";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

type Props = {};

export default async function page({}: Props) {
  const session = await getServerSession(authOptions);

  const friendIds = (await fetchRedis(
    `smembers`,
    `user:${session?.user.id}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendIds.map(async (id) => {
      const friend = JSON.parse(await fetchRedis(`get`, `user:${id}`)) as User;
      return friend;
    })
  );

  return (
    <main className=" h-full">
      <div className="p-4 border-b h-20 flex items-center gap-5 justify-between">
        <HeaderSection
          header="Yours truly"
          subheader="Manage, search and send a message to friends here"
        />
      </div>
      <FriendList friends={friends} sessionId={session?.user.id || ""} />
    </main>
  );
}
