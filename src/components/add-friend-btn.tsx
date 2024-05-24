"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

type AddFriendFormData = z.infer<typeof addFriendValidator>;
type AddFriendButtonProps = {};

function AddFriendButton({}: AddFriendButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddFriendFormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post("/api/friends/add", { email: validatedEmail });
      setShowSuccess(true);
    } catch (error) {
      // either toast general error or check for error type and handle separately
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        toast.error(error.message);
        return;
      }
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }
      setError("email", { message: "Something went wrong." });
    }
  };

  const onSubmit = (data: AddFriendFormData) => {
    addFriend(data.email);
  };

  return (
    <form
      className="relative grow max-w-sm flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-row gap-4">
        <Input
          type="text"
          placeholder="friend@example.com"
          {...register("email")}
          onKeyDown={() => setShowSuccess(false)}
        />
        <Button type="submit" size="sm">
          {showSuccess ? (
            <div className="gap-2 flex items-center">
              Sent
              <Check className="w-3 h-3" />
            </div>
          ) : (
            "Add friend"
          )}
        </Button>
      </div>

      <p className="absolute text-xs text-muted-foreground -bottom-5 ml-2">
        {errors.email?.message}
      </p>
    </form>
  );
}

export default AddFriendButton;
