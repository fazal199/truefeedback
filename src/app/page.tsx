"use client"
import React from "react";
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json"
import { Mail } from "lucide-react";

const HomePage = () => {
  return (
    <>
      <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="w-[98vw] sm:w-auto text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the mystery world
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore mystery messages - where your identity remain a secret
          </p>
  
          {/* carouesel side */}
          <Carousel
            // plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-lg md:max-w-xl"
          >
            <CarouselContent className="w-full">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4 w-full">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0 mt-2" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground text-left">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </div>
      
    </>
  );
};

export default HomePage;
