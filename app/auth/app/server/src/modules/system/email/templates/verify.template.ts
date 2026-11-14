import { MailTemplate, VerifyData } from "shared/types/main.ts";
import { getBaseTemplate } from "./main.ts";

export const verifyTemplate: MailTemplate<VerifyData> = (data) => ({
  subject: "[OpenHotel] - 🔒Verify your account",
  text: `
    Please verify your account:\n\n${data.verifyUrl}
    
    If you did not request this email, you can ignore it.
    The OpenHotel Team
  `,
  html: getBaseTemplate({
    title: "Verify your account",
    body: `
      <p>Thank you for signing up for OpenHotel!</p>
      <p>To complete your registration, please click the button below to verify your email address:</p>
      
      <p style="text-align: center; margin: 40px 0;">
        <a href="${data.verifyUrl}" class="button">VERIFY ACCOUNT</a>
      </p>
      
      <p>If the button does not work, copy and paste the following URL into your browser:</p>
      <p><a href="${data.verifyUrl}">${data.verifyUrl}</a></p>
      
      <p><em>This link will expire in 24 hours.</em></p>
    `,
  }),
});
