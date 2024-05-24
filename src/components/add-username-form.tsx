"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2).max(30),
});

type AddUsernameFormProps = {
  onNext?: ({ name }: { name: string }) => void;
};
export function AddUsernameForm({ onNext }: AddUsernameFormProps) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Pass email outward to the sign-up-stepper
    onNext?.({ name: values.name });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Mr. Knuckle Head" {...field} />
              </FormControl>
              <FormMessage className="text-muted-foreground" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="sm">
          Continue
        </Button>
      </form>
    </Form>
  );
}
