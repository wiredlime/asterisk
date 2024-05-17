"use client";

import React, { ButtonHTMLAttributes, useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";

interface SignOutButtonProps extends ButtonProps {}

const SignOutButton = ({
  variant = "ghost",
  size,
  className,
  ...props
}: SignOutButtonProps) => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleClick = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      toast.error("There was a problem signing out");
    } finally {
      setIsSigningOut(false);
    }
  };
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      {isSigningOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SignOutButton;
