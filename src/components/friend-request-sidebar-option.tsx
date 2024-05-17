"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

type FriendRequestSidebarOptionProps = {
  sessionId: string;
  initialUnseenRequestCount: number;
};

function FriendRequestSidebarOption({
  sessionId,
  initialUnseenRequestCount,
}: FriendRequestSidebarOptionProps) {
  const [unseenRequestCount, setUnseenRequestCount] = useState(
    initialUnseenRequestCount
  );

  const requests = useMemo(() => {
    if (unseenRequestCount > 0) {
      return (
        <div className="rounded-full font-medium text-xs w-5 h-5 flex justify-center items-center bg-primary text-primary-foreground">
          {unseenRequestCount}
        </div>
      );
    }
  }, [unseenRequestCount]);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1);
    };
    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1);
    };
    pusherClient.bind(`incoming_friend_requests`, friendRequestHandler);
    pusherClient.bind(`new_friend`, addedFriendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind(`incoming_friend_requests`, friendRequestHandler);
      pusherClient.unbind(`new_friend`, addedFriendHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-3 rounded-md p-2 text-sm leading-6"
    >
      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <Users className="h-4 w-4" />
      </span>

      <span className="truncate">Friend requests</span>
      {requests}
    </Link>
  );
}

export default FriendRequestSidebarOption;
