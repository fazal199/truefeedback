import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest,NextResponse } from "next/server";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { UserModel } from "@/models/user.model";

export async function GET(request: NextRequest) {
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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    
    const user = await UserModel.aggregate([
        {$match : {_id : userId}},
        {$unwind : "$messages"},
        {$sort : {"messages.createdAt" : -1}},
        {$group : {_id : "$_id",messages: {$push : "$messages"}}}
    ])

    if(!user || user.length == 0)
        {
            return NextResponse.json({
              success: false,
              status: 401,
              msg: "User not found!",
            });
        }

        return NextResponse.json({
          success: true,
          status: 200,
          messages: user[0].messages
        });
  } catch (error: any) {
    console.log("something went wrong in get-message controller");
    return NextResponse.json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
}