export * from "./verify.template.ts";
export * from "./change-password.template.ts";

interface BaseTemplateProps {
  title: string;
  body: string;
  styles?: string;
}

export const getBaseTemplate = ({
  title,
  body,
  styles = "",
}: BaseTemplateProps) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"> 
      <style>
        .container { max-width: 600px; margin: 20px auto; padding: 20px; font-family: Arial, sans-serif; }
        .header { color: #2F3133; font-size: 24px; border-bottom: 1px solid #EDEFF2; padding-bottom: 10px; text-align: center; }
        .content { margin: 20px 0; color: #444; line-height: 1.6; }
        .footer { 
          margin-top: 20px; 
          padding-top: 20px; 
          border-top: 1px solid #EDEFF2; 
          color: #9BA6B2; 
          font-size: 12px;
        }
        .social-icons {
          margin-bottom: 10px;
        }
        .social-icons a {
          margin: 0 5px;
          display: inline-block;
        }
        .social-icons img {
          width: 24px;
          height: auto;
        }
        .button { 
          display: inline-block; 
          background-color: #007BFF; 
          color: white !important; 
          padding: 12px 25px; 
          border-radius: 5px; 
          text-decoration: none;
          font-weight: bold;
        }
        ${styles}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="https://openhotel.club"><img src="https://static.openhotel.club/_/01JMMNMVFH9ZWCC4RZ829WMF3E" alt="OpenHotel Logo" width="150"></a>
          <h1>${title}</h1>
        </div>
        
        <div class="content">
          ${body}
        </div>
        
        <div class="footer">
          <p>If you did not request this, you can ignore this message.</p>
          <div class="social-icons">
            <a href="https://bsky.app/profile/openhotel.club" target="_blank">
              <img src="https://static.openhotel.club/_/01JMMQTS6EY7N04AD3AA9XKVPY" alt="Bluesky">
            </a>
            <a href="https://discord.gg/qBZfPdNWUj" target="_blank">
              <img src="https://static.openhotel.club/_/01JMMQTXZ0XYSYEDGDYCJPBC2P" alt="Discord">
            </a>
            <a href="https://github.com/openhotel" target="_blank">
              <img src="https://static.openhotel.club/_/01JMMQV1ZJGHBBTWR31493QED9" alt="GitHub">
            </a>
          </div>
          <p>© ${new Date().getFullYear()} OpenHotel. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
};
