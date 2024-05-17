"use client";

import MyButton from "@/components/my-button.tsx/my-button";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function loginWithGoogle() {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("Something went wrong with your login");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="">
      <Button onClick={loginWithGoogle} variant="default" className="space-x-3">
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
  );
};

export default Page;
