import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { Message } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "User not found!",
      });
    }

    if (!user.isAcceptingMessages) {
      return NextResponse.json({
        success: false,
        status: 403,
        message: "User is not accepting the messages!",
      });
    }

    const newMessage = { content, createdAt: new Date(Date.now()) };
    user.messages.push(newMessage as Message);

    await user.save();

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Message sent successfully!",
    });
    
  } catch (error: any) {
    console.log("something went wrong in send-message controller!");

    return NextResponse.json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
}
