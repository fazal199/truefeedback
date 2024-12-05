import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { usernameValidation } from "@/zodSchemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const userQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    //retriving the query string from url
    const { searchParams } = new URL(request.url);

    const queryParams = {
      username: searchParams.get("username"),
    };

    //validate with zod
    const result = userQuerySchema.safeParse(queryParams);
    // console.log(result);

    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];
    //   console.log(userNameErrors);
      
      return NextResponse.json({
        success: false,
        status: 409,
        msg:
          userNameErrors?.length > 0
            ? userNameErrors.join(", ")
            : "Invalid username!",
      });
    }

    const { username } = result.data;

    const existingUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUsername)
      return NextResponse.json({
        success: false,
        status: 401,
        msg: "Username is already taken!",
      });

    return NextResponse.json({
      success: true,
      status: 200,
      msg: "Username is available!",
    });


  } catch (error: any) {
    console.log("something went wrong in check-username-unique controller");
    console.log(error.message);
    return NextResponse.json({
      success: false,
      status: 500,
      msg: "something went wrong in check-username-unique controller!",
    });
  }
}
