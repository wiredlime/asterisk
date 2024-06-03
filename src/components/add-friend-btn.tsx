"use client";
import React, { useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Check, Loader2 } from "lucide-react";

type AddFriendFormData = z.infer<typeof addFriendValidator>;
type AddFriendButtonProps = {};

function AddFriendButton({}: AddFriendButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AddFriendFormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    setIsLoading(true);
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post("/api/friends/add", { email: validatedEmail });
      setIsLoading(false);
      setShowSuccess(true);
    } catch (error) {
      // either toast general error or check for error type and handle separately
      if (error instanceof z.ZodError) {
        setIsLoading(false); // Have to set loading false here, since zod error throw before executing line 31
        const errorMsg = JSON.parse(error.message)[0].message;
        setError("email", { message: errorMsg });
        return;
      }
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }
      setError("email", { message: "Something went wrong" });
    }
  };

  const onSubmit = (data: AddFriendFormData) => {
    addFriend(data.email);
  };

  const formStateIndicator = useMemo(() => {
    if (isLoading) {
      return <Loader2 className="text-muted-foreground w-4 h-5 animate-spin" />;
    } else if (showSuccess) {
      return (
        <div className="gap-2 flex items-center">
          Sent
          <Check className="w-3 h-3" />
        </div>
      );
    }
    return null;
  }, [isLoading, showSuccess]);

  return (
    <form
      className="relative grow max-w-sm flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-row gap-4">
        <Input
          type="text"
          placeholder="friend@example.com"
          className="text-foreground"
          {...register("email")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFriend(e.currentTarget.value);
            }
            setShowSuccess(false);
          }}
          endAdornment={formStateIndicator}
        />
      </div>

      <p className="absolute text-xs text-muted-foreground -bottom-5 ml-2">
        {errors.email?.message}
      </p>
    </form>
  );
}

export default AddFriendButton;
