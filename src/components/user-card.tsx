"use client";
import { Separator } from "./ui/separator";
import NextAvatar from "./ui/next-avatar";
import FriendActionButton from "./friend-action-button";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { AVATAR_FALLBACK } from "@/lib/constant";
import { randomGradientGenerator } from "@/lib/utils";

type UserCardProps = {
  isFriend: boolean;
  name: string;
  email: string;
  image: string;
};

const UserCard = ({ isFriend, name, email, image }: UserCardProps) => {
  return (
    <Card className="gay:bg-background px-4 pb-4 pt-8 relative min-w-[223px] hover:cursor-pointer hover:shadow-md h-fit shrink-0 grow-0 flex flex-col items-center gap-2 rounded-xl">
      <div
        className="absolute top-0 h-1/3 w-full rounded-t-xl flex justify-center bg-accent"
        style={{
          backgroundImage: randomGradientGenerator(),
        }}
      ></div>
      <div className="rounded-full z-10">
        <Image
          placeholder="blur"
          blurDataURL={AVATAR_FALLBACK}
          referrerPolicy="no-referrer"
          width={130}
          height={130}
          src={image || ""}
          alt={`${name} profile`}
          className="rounded-full"
        />
      </div>

      <CardContent className="p-0">
        <div className="w-full flex flex-col items-center">
          <h4 className="text-sm font-medium text-foreground leading-none">
            {name}
          </h4>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center gap-2 justify-around text-sm">
          <NextAvatar
            src={image}
            alt={`${name} profile picture`}
            size={10}
            className="bg-transparent shrink-0"
          />
          <Separator orientation="vertical" className="h-8" />
          <FriendActionButton isFriend={isFriend} friendEmail={email} />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
