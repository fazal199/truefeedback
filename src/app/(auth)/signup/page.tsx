"use client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/zodSchemas/signUpSchema";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Loader2 } from "lucide-react";
import Link from "next/link";


const SignUpPage = () => {
  const { toast } = useToast();
  const navigate = useRouter();

  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUserNameMessage] = useState<string>("");

  const [isCheckingUserName, setIsCheckingUserName] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const debouncedUserName = useDebounceCallback(setUsername, 500);

  //zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup",data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      navigate.replace(`/verify/${username}`);

    } catch (error) {
      console.log("something went wrong while signup the user!");
      const axiosError = error as AxiosError<ApiResponse>;
      setUserNameMessage(
        axiosError.response?.data.message || "Error while signup the user!"
      );

      toast({
        variant: "destructive",
        title: "signup failed",
        description: "something went wrong while singuping the user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username) {
        setIsCheckingUserName(true);
        setUserNameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          console.log(response.data.msg);
          setUserNameMessage(response.data.msg)
        } catch (error) {
          console.log(
            "something went wrong while checking the username is unique or not"
          );
          const axiosError = error as AxiosError<ApiResponse>;
          setUserNameMessage(
            axiosError.response?.data.message || "Error checking username"
          );
        } finally {
          setIsCheckingUserName(false);
        }
      }
    };

    if(username.length != 0)
    checkUserNameUnique();
  }, [username]);

  return (
    <div className="flex justify-center px-5 items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md py-8 px-5 sm:p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            join mystery message
          </h1>
          <p className="mb-4 text-lg mt-5 capitalize">signup to start anonymous messages</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedUserName(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUserName && <Loader2 className="animate-spin" />}
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is available!"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                  
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size={"lg"} className="text-md font-semibold mt-4 w-full"  disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  please wait
                </>
              ) : (
                "SignUp"
              )}
            </Button>
          </form>
        </Form>
        <div>
          <p className="text-center">
            Already a Member?{" "}
            <Link className="hover:text-blue-800 text-black underline font-semibold" href="/sign-in">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
