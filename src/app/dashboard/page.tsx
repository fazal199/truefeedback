"use client";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/user.model";
import { ApiResponse } from "@/types/apiResponse";
import { acceptMessagesSchema } from "@/zodSchemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitchingLoading, setisSwitchingLoading] = useState<boolean>(false);

  const { toast } = useToast();

  //optimistic ui is being followed here means we will changes the ui suddenly and then will do the remaining work on the backend side

  const { data: session } = useSession();

  const handleDeleteMessage = (messageId: string) => {
    const allMessagesExceptTheDeletedOne = messages?.filter(
      (message) => message._id !== messageId
    );
    setMessages(allMessagesExceptTheDeletedOne);
  };

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, setValue, watch } = form;

  
  const acceptMessages = watch("acceptMessages");
  
  

  const fetchAcceptingMessage = useCallback(async () => {
    setisSwitchingLoading(true);
    try {
      setisSwitchingLoading(true);
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to fetch the accept-message!",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch accept messages",
        variant: "destructive",
      });
    } finally {
      setisSwitchingLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false ) => {
      setLoading(true);
      setisSwitchingLoading(true);

      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data?.messages);

        if (refresh)
          toast({
            title: "refreshed messages!",
            description: "Showing latest messages",
          });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Failed to fetch the messages!",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch the messages from the backend",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setisSwitchingLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  useEffect(() => {
    if (!session && !session?.user) return;

    fetchMessages();
    fetchAcceptingMessage();
  }, [setValue, session, fetchAcceptingMessage, fetchMessages]);

  const handleSwtichChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "accept message changed!",
        description: response.data.message,
      });

    } catch (error) {}
  };


  let profileUrl = "";
  if(session && session.user)
    {
      const {username} = session?.user as User;
      const baseUrl = `${location.protocol}//${location.host}`;
      profileUrl = `${baseUrl}/u/${username}`;
    }

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl);
    toast({
      title : "Url copied",
      description : "profile url has been copied"
    })
  }

  if(!session || !session.user)
    return <div>please login first</div>

  return (
    <div className="my-8 sm:mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex my-4 flex-col items-start sm:flex-row sm:items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button className="mt-2 sm:mt-0" onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwtichChange}
          disabled={isSwitchingLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />


      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 space-y-10 sm:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages?.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );;
};

export default Dashboard;
