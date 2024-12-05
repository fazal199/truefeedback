import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUserName = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUserName });

    if (!user) {
      return NextResponse.json({
        success: false,
        status: 401,
        msg: "User not found!",
      });
    }

    
    const verifyUser = await UserModel.findOne({verifyCode: code,verifyCodeExpiry: { $gt: Date.now() }});
    
    if (!verifyUser) {
      return NextResponse.json({
        success: false,
        status: 401,
        msg: "Invalid verify code!",
      });
    }

    verifyUser!.isVerified = true;
    verifyUser!.verifyCode = "verified";
    verifyUser!.verifyCodeExpiry = new Date();

    await verifyUser.save();

    return NextResponse.json({
      success: true,
      status: 200,
      msg: "User has been verified!",
    });
    
  } catch (error: any) {
    console.log("something went wrong in verify-code controller");
    console.log(error.message);
    return NextResponse.json({
      success: false,
      status: 500,
      msg: "something went wrong in verify-code controller!",
    });
  }
}
