import { Button } from "@/components/ui/button";
import HeaderSection from "@/components/ui/header-section";
import { Input } from "@/components/ui/input";
import NextAvatar from "@/components/ui/next-avatar";
import { UserInfoBox } from "@/components/user-info-box";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { Search, Send, UserCheck } from "lucide-react";
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
    <div>
      <div className="p-4 border-b h-20 flex items-center gap-5 justify-between">
        <HeaderSection />
      </div>
      <div className="flex flex-row justify-end gap-4 p-4">
        <Input
          className="max-w-sm"
          placeholder="Look friend up by their email..."
          startAdornment={<Search className="w-4 h-4" />}
        />
        <Button size="sm">Search</Button>
      </div>
      {friends.length ? (
        <div className="flex flex-wrap gap-10 p-10 w-full">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="w-56 h-56 flex flex-col justify-center items-center gap-2  p-4 border rounded-2xl shadow-sm"
            >
              <div className="grid place-items-center">
                <div className="flex-shrink-0 mb-4">
                  <NextAvatar
                    src={friend.image || ""}
                    alt={`${friend.name} profile picture`}
                    className="w-20 h-20"
                  />
                </div>
                <p className="text-sm font-medium">{friend.name}</p>
                <p className="text-sm text-muted-foreground">{friend.email}</p>
              </div>
              <div className="w-full flex items-center gap-2">
                <Button
                  className="grow gap-2"
                  size="sm"
                  // variant="outline"
                  // onClick={handleUnfriend}
                >
                  <Send className="w-4 h-4" />
                </Button>

                <Button
                  className="w-full gap-2"
                  size="sm"
                  variant="outline"
                  // onClick={handleUnfriend}
                >
                  Friend
                  <UserCheck className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center py-10">
          <p className="text-muted-foreground">
            You have no friends yet, let&apos;s add some
          </p>
        </div>
      )}
    </div>
  );
}
