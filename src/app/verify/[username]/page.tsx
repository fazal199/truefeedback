"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { verifySchema } from "@/zodSchemas/verifySchema";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import {
 Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyEmailPage = () => {
  const navigate = useRouter();
  const { toast } = useToast();
  const { username } = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      await axios.post("/api/verify-code", {
        username,
        code: data.code,
      });

      toast({
        title: "Sucess",
        description: "Email verified successfully!",
      });

      navigate.replace("/sign-in");
    } catch (error) {
      console.log("something went wrong while verifying the eamil of user!");
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        variant: "destructive",
        title: "Email verification failed",
        description: axiosError.response?.data.message,
      });
    }
  };

  return (<div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">An Email has been sent to your Email!</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your verification code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Verify</Button>
        </form>
      </Form>
    </div>
  </div>)
};

export default VerifyEmailPage;
