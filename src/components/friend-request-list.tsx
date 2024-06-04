"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { UserInfoBox } from "./user-info-box";
import { Badge } from "./ui/badge";
import { APP_ORIGIN } from "@/lib/constant";

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
    if (incomingRequests.length > 0) {
      return incomingRequests.map((request) => (
        <div
          key={request.senderId}
          className="p-4 border-b hover:bg-accent/40 flex justify-between items-center"
        >
          <UserInfoBox
            image={request.senderImage || ""}
            name={request.senderName || ""}
            email={request.senderEmail || ""}
          />

          <div className="flex items-center gap-2">
            <FriendRequestActionButton
              type="accept"
              senderId={request.senderId}
              onClick={() =>
                setIncomingRequests((prev) =>
                  prev.filter((req) => req.senderId !== request.senderId)
                )
              }
            />
            <FriendRequestActionButton
              type="deny"
              senderId={request.senderId}
              onClick={() =>
                setIncomingRequests((prev) =>
                  prev.filter((req) => req.senderId !== request.senderId)
                )
              }
            />
          </div>
        </div>
      ));
    }

    return (
      <div className="grid place-items-center text-muted-foreground py-10">
        No incoming requests
      </div>
    );
  }, [incomingRequests]);

  return (
    <div className="flex flex-col">
      <div className="border-b p-4 px-6 h-20 flex items-center justify-between">
        <p className="text-muted-foreground">All requests</p>
        <p className="text-muted-foreground">{incomingRequests.length}</p>
      </div>
      {requestLists}
    </div>
  );
}

type FriendRequestActionButtonProps = {
  type: "accept" | "deny";
  senderId: string;
  onClick?: VoidFunction;
};

const FriendRequestActionButton = ({
  onClick,
  senderId,
  type,
}: FriendRequestActionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestActions = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${APP_ORIGIN}/api/friends/${type}`, { id: senderId });
      // Filter out with state to make interactive UI
      // setIncomingRequests((prev) =>
      //   prev.filter((request) => request.senderId !== senderId)
      // );

      onClick?.();
      setIsLoading(false);
      // router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const icon =
    type === "accept" ? (
      <Check className="w-4 h-4 text-primary-foreground" />
    ) : (
      <X className="w-4 h-4" />
    );

  return (
    <Badge
      className={cn("hover:cursor-pointer", {
        "bg-foreground": type === "accept",
      })}
      variant={type === "accept" ? "default" : "outline"}
      onClick={handleRequestActions}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
      ) : (
        icon
      )}
    </Badge>
  );
};
