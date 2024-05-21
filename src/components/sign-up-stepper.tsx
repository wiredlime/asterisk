"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { AddEmailForm } from "./add-email-form";

import axios from "axios";
import { AddUsernameForm } from "./add-username-form";
import { AddImageForm } from "./add-image-form";
import { PartyPopper } from "lucide-react";
import { signUpValidator } from "@/lib/validations/sign-up";
import { Fighter } from "@/app/(auth)/login/page";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const TOTAL_STEPS = 4;

type AccountSetup = {
  email?: string;
  name?: string;
  image?: string;
};

export default function SignUpStepper() {
  const [step, setStep] = useState(-1);
  const [info, setInfo] = useState<AccountSetup>({});

  const handleNext = async (value: AccountSetup) => {
    setStep((prev) => prev + 1);
    setInfo((prev) => ({ ...prev, ...value }));

    // At 3rd step - profile image selection, register a new user account
    if (step === 2 && info.email && info.name && value) {
      const { email, name, image } = signUpValidator.parse({
        image: value.image,
        email: info.email,
        name: info.name,
      });

      try {
        await axios.post("/api/auth/register", {
          email: email,
          name: name,
          image: image,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (step < 0 || step >= TOTAL_STEPS) {
      setTimeout(() => {
        setStep(0);
      }, 200);
    }
  }, [step]);

  return (
    <div className={cn("container max-w-xl px-3 space-y-3")}>
      {/* {step >= 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {step + 1}/{TOTAL_STEPS}
        </p>
      )} */}
      {step === 0 && <AddEmailForm onNext={handleNext} />}
      {step === 1 && <AddUsernameForm onNext={handleNext} />}
      {step === 2 && <AddImageForm onNext={handleNext} />}
      {step === 3 && (
        <RegistrationSuccess
          name={info.name || ""}
          image={info.image || ""}
          email={info.email || ""}
        />
      )}
    </div>
  );
}

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
