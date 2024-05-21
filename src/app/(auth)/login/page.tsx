"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import SignUpStepper from "@/components/sign-up-stepper";
import { defaultProfiles } from "@/lib/constant";

const Page = () => {
  async function loginWithGoogle() {
    try {
      await signIn("google");
    } catch (error) {
      toast.error("Something went wrong with your login");
    }
  }

  async function handleDefaultAccountLogin(email: string) {
    try {
      await signIn("credentials", { email });
    } catch (error) {
      toast.error("Something went wrong with your login");
    }
  }

  return (
    <div className="container h-screen min-w-full grid place-items-center">
      <div className="flex flex-row items-center gap-20">
        <div className="h-fit w-fit">
          <div className="space-y-10">
            <div className="space-y-2 grid place-items-center">
              <h4>Let&apos;s get started!</h4>
              <p className="max-w-sm text-center text-muted-foreground line-clamp-2">
                Enter your email below to create an account, or just kindly pick
                a fighter on the left
              </p>
            </div>
            <SignUpStepper />
          </div>
          <div className="flex items-center gap-2 mt-10 mb-5">
            <Separator className="shrink" />
            <p className="tex-xs text-muted-foreground">else</p>
            <Separator className="shrink" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={loginWithGoogle}
              variant="outline"
              className="grow space-x-3"
            >
              <Image
                src="/discord.svg"
                alt="Discord Logo"
                width={20}
                height={20}
                priority
              />

              <span>Sign in with Discord</span>
            </Button>
            <Button
              onClick={loginWithGoogle}
              variant="outline"
              className="grow space-x-3"
            >
              <Image
                src="/google.svg"
                alt="Google Logo"
                width={20}
                height={20}
                priority
              />
              <span>Sign in with Google</span>
            </Button>
          </div>
        </div>
        <Separator orientation="vertical" className="h-40" />
        <div className="space-y-10">
          <div className="flex items-center gap-2">
            {defaultProfiles.map((profile) => (
              <Fighter
                key={profile.name}
                image={profile.image}
                name={profile.name}
                bio={profile.bio}
                onClick={() => handleDefaultAccountLogin(profile.email)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type FighterProps = {
  image: string;
  name: string;
  bio?: string;
  onClick?: VoidFunction;
};

export const Fighter = ({ image, name, bio, onClick }: FighterProps) => {
  const handleSelectFighter = async () => {
    onClick?.();
  };
  return (
    <div
      className="group space-y-4 grid place-items-center"
      onClick={handleSelectFighter}
    >
      <div className="bg-accent/20 rounded-full">
        <Image
          referrerPolicy="no-referrer"
          width={180}
          height={180}
          src={image}
          alt={`${name} profile`}
          className="group-hover:cursor-pointer group-hover:scale-110 duration-150"
        />
      </div>
      <div className="grid place-items-center group-hover:mt-6">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{bio}</p>
      </div>
    </div>
  );
};
export default Page;
