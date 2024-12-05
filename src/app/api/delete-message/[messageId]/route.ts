import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest,NextResponse } from "next/server";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { UserModel } from "@/models/user.model";

export async function DELETE(request: NextRequest,{params} : {params : {messageId : string}}) {

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  
  if (!session && !user) {
    return NextResponse.json({
      status: 401,
      message: "User is not authenticated!",
      success: false,
    });
  }

  await dbConnect();

  const messageId = params.messageId;
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    
    const updatedUser = await UserModel.updateOne({_id : userId},{$pull : {messages : {_id : messageId}} })

    if(updatedUser.modifiedCount == 0)
        return NextResponse.json({
          success: true,
          status: 404,
          messages: "Message not found or already deleted!"
        });

    return NextResponse.json({
          success: true,
          status: 200,
          messages: "Message deleted!"
    });

  } catch (error: any) {
    console.log("Something went wrong while deleting message");
    return NextResponse.json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
}