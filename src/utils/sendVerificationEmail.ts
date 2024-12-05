import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailOptions = {
      from: process.env.RESEND_DOMAIN as string,
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    };

    const data = await resend.emails.send(emailOptions);

    return { success: true, message: "verification email sent successfully!" };
  } catch (error) {
    console.log("something went wrong while sending the email!");
    return { success: false, message: "failed to send the verification email" };
  }
}
