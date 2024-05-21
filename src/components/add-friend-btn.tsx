"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";

type AddFriendFormData = z.infer<typeof addFriendValidator>;
type AddFriendButtonProps = {};

// form input and button
function AddFriendButton({}: AddFriendButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
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
      className="grow max-w-sm flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-row gap-4">
        <Input
          type="text"
          placeholder="friend@example.com"
          {...register("email")}
        />
        <Button type="submit" size="sm">
          Add friend
        </Button>
      </div>

      <p className="text-destructive">{errors.email?.message}</p>
      {showSuccess && "Friend request sent"}
    </form>
  );
}

export default AddFriendButton;
