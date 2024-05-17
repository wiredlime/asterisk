"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";
import NextAvatar from "./ui/next-avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

type FriendRequestListProps = {
  requests: IncomingFriendRequest[];
  sessionId: string;
};

// Using client component for real time feature such as this
export default function FriendRequestList({
  requests,
  sessionId,
}: FriendRequestListProps) {
  const router = useRouter();
  const [incomingRequests, setIncomingRequests] = useState(requests);

  // Listen to the event on the client:
  // 1. Use the pusher client to subscribe the changes of incoming_friend_requests
  // 2. Also execute a call back every time that event is fired (by binding the event with a handler)
  // 3. Remember to unsubscribe and unbind as component unmount
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendRequestHandler = ({
      senderId,
      senderEmail,
      senderName,
      senderImage,
    }: IncomingFriendRequest) => {
      setIncomingRequests((prev) => [
        ...prev,
        {
          senderId,
          senderImage,
          senderEmail,
          senderName,
        },
      ]);
    };
    pusherClient.bind(`incoming_friend_requests`, friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind(`incoming_friend_requests`, friendRequestHandler);
    };
  }, [sessionId]);

  const requestLists = useMemo(() => {
    const handleRequestActions = async (
      senderId: string,
      action: "accept" | "deny"
    ) => {
      await axios.post(`/api/friends/${action}`, { id: senderId });
      // Filter out with state to make interactive UI
      setIncomingRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );
      router.refresh();
    };

    if (incomingRequests.length > 0) {
      return incomingRequests.map((request) => (
        <div
          key={request.senderId}
          className="flex items-center justify-between hover:bg-accent p-2"
        >
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              {/* <NextAvatar
                src={request.senderImage || ""}
                alt="Friend profile image"
              /> */}
              <span className="font-medium">{request.senderName}</span>
              <span className="text-xs text-muted-foreground">
                {request.senderEmail}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="rounded-full h-0 p-4"
              onClick={() => handleRequestActions(request.senderId, "accept")}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-0 p-4"
              onClick={() => handleRequestActions(request.senderId, "deny")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ));
    }

    return (
      <div className="grid place-items-center text-muted-foreground">
        No incoming requests
      </div>
    );
  }, [incomingRequests, router]);

  return <div className="flex flex-col gap-4">{requestLists}</div>;
}
