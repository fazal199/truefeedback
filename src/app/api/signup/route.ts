import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();

    //checking if the username is available
    let user = await UserModel.findOne({ username, isVerified: true });

    if (user)
      return NextResponse.json({
        success: false,
        message: "UserName is Already Taken!",
        status: 400,
      });

    //checking if the user with same email already exist
    user = await UserModel.findOne({ email });

    const verifyCode = String(Math.floor(Math.random() * 900000));

    if (user) {
      //if the user which exists with the same email and he/she is verified
      if (user.isVerified) {
        return NextResponse.json({
          success: false,
          message: "User alreay exist with this email!",
          status: 401,
        });

        //if he/she is not verified it means that the current signup is being done by him/her
      } else {
        const hashPassword = await bcryptjs.hash(password, 10);
        user.password = hashPassword;
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await user.save();
      }
    } else {
      const hashPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();

      expiryDate.setHours(expiryDate.getHours() + 1);

      await UserModel.create({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessages: true,
        messages: [],
      });
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    //if the email sending got failed
    if (!emailResponse.success) {
      return NextResponse.json({
        success: false,
        message: emailResponse.message,
        status: 500,
      });
    }

    //signup successfully!
    return NextResponse.json({
      success: true,
      message: "User Registered Successfully!",
      status: 200,
    });
  } catch (error: any) {
    console.log("something went wrong in signUp controller! [api/signup]");
    console.log(error.message);
    
    return NextResponse.json({
      success: false,
      message: "Error while registering the user",
      status: 500,
    });
  }
}
