"use client";

import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Fighter from "./fighter";
import { Button } from "./ui/button";
import { PartyPopper } from "lucide-react";

type RegistrationSuccessProps = {
  name: string;
  image: string;
  email: string;
};
const RegistrationSuccess = ({
  name,
  email,
  image,
}: RegistrationSuccessProps) => {
  const handleClick = async () => {
    try {
      const response = await signIn("credentials", { email });
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Failed to sign you in");
    }
  };
  return (
    <div className="grid place-items-center space-y-5">
      <Fighter image={image} name={name} bio={email} />
      <Button className="w-full gap-2" size="sm" onClick={handleClick}>
        <PartyPopper className="w-4 h-4" />
        Join now
      </Button>
    </div>
  );
};

export default RegistrationSuccess;
