"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";
import { AddEmailForm } from "./add-email-form";
import axios from "axios";
import { AddUsernameForm } from "./add-username-form";
import { AddImageForm } from "./add-image-form";
import { signUpValidator } from "@/lib/validations/sign-up";
import RegistrationSuccess from "./registration-success";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { APP_ORIGIN } from "@/lib/constant";

const TOTAL_STEPS = 4;

type AccountSetup = {
  email?: string;
  name?: string;
  image?: string;
};

export default function SignUpStepper() {
  const [step, setStep] = useState(-1);
  const [info, setInfo] = useState<AccountSetup>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (step < 0 || step >= TOTAL_STEPS) {
      setTimeout(() => {
        setStep(0);
      }, 100);
    }
  }, [step]);

  const content = useMemo(() => {
    const handleNext = async (value: AccountSetup) => {
      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep((prev) => prev + 1);

      setInfo((prev) => ({ ...prev, ...value }));
      setIsSuccess(false);

      // At 3rd step - profile image selection, register a new user account
      if (step === 2 && info.email && info.name && value) {
        const { email, name, image } = signUpValidator.parse({
          image: value.image,
          email: info.email,
          name: info.name,
        });

        try {
          const response = await axios.post(`${APP_ORIGIN}/api/auth/register`, {
            email: email,
            name: name,
            image: image,
          });

          console.log("New account registration response:", response);
        } catch (error) {
          console.log(error);
          toast("Account is not registered");
        }
      }
    };

    if (!isSuccess) {
      return (
        <>
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
        </>
      );
    } else {
      return <SuccessContent />;
    }
  }, [info.email, info.image, info.name, isSuccess, step]);

  return (
    <div className={cn("container max-w-xl px-3 space-y-3")}>
      {/* {step >= 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {step + 1}/{TOTAL_STEPS}
        </p>
      )} */}
      {content}
    </div>
  );
}

const SuccessContent = () => {
  return (
    <div className="grid place-items-center space-y-6">
      <div className="bg-accent/40 rounded-full w-40 h-40 p-4 grid place-items-center animate-pulse">
        <Check className="w-24 h-24" />
      </div>
      <p className="text-muted-foreground text-xs text-center">
        Success! Let&apos;s move on
      </p>
    </div>
  );
};
