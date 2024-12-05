"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod"
import {signInSchema} from "@/zodSchemas/signInSchema"
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage,FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';


const SignInPage = () => {
  

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {toast} = useToast();
  const navigate = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    
    if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
    }

    if (result?.url) {
      setIsSubmitting(false);
      navigate.replace('/dashboard');
      
    }
  };
  return (
    <div className="flex px-3 justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full relative -top-24 sm:static max-w-md py-8 px-5 sm:p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back!
          </h1>
          <p className="mb-4 text-lg">Login to your Account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-6'>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Email/Username"
                        {...field}
                      />
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
                      <Input placeholder="Enter your Password" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
         
            <Button type="submit" size={"lg"} className="text-md font-semibold mt-4 w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  please wait
                </>
              ) : (
                "SignIn"
              )}
            </Button>
          </form>
        </Form>
        <div>
          <p className='text-center'>
            Dont' have an account?{" "}
            <Link className="hover:text-blue-800 text-black underline font-semibold" href="/signup">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
