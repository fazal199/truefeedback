import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session && !user) {
    return NextResponse.json({
      status: 401,
      message: "User is not authenticated!",
      success: false,
    });
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        status: 401,
        msg: "can't update Message Acceptance status",
      });
    }

    return NextResponse.json({
      success: false,
      status: 200,
      message: "Message Acceptance status updated successully!",
    });
  } catch (error: any) {
    console.log("something went wrong in accept-message controller");
    return NextResponse.json({
      success: false,
      status: 500,
      msg: error.message,
    });
  }
}

export async function GET() {
  try {
    await dbConnect();
  
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
  
    if (!session && user) {
      return NextResponse.json({
        status: 401,
        message: "User is not authenticated!",
        success: false,
      });
    }
  
    const userId = user._id;
  
    const foundUser = await UserModel.findById(userId);
  
    if (!foundUser) {
      return NextResponse.json({
        status: 401,
        message: "failed to found user!",
        success: false,
      });
    }
  
    return NextResponse.json({
      status: 200,
      isAcceptingMessages : foundUser.isAcceptingMessages,
      success: true,
    });
    
  } catch (error: any) {
    console.log("something went wrong while sending accept-message status");
    return NextResponse.json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
}
