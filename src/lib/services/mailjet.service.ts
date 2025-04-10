import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY || '',
  apiSecret: process.env.MAILJET_API_SECRET || '',
});

export const sendVerificationEmail = async (
  email: string,
  code: string,
  username: string
) => {
  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "jeshwar2009@gmail.com",
            Name: 'ConstructHub.ai',
          },
          To: [
            {
              Email: email,
              Name: username,
            },
          ],
          Subject: 'Verify your email for ConstructHub.ai',
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; padding: 10px 20px; background: linear-gradient(to right, #3B82F6, #06B6D4); border-radius: 50px; margin-bottom: 10px;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">ConstructHub.ai</h1>
                </div>
                <h2 style="color: #333; margin: 10px 0;">Email Verification</h2>
              </div>

              <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p style="color: #555; font-size: 16px;">Hello <strong>${username}</strong>,</p>
                <p style="color: #555; font-size: 16px;">Thank you for signing up with ConstructHub.ai. To complete your registration, please use the verification code below:</p>

                <div style="background: linear-gradient(to right, #3B82F6, #06B6D4); padding: 15px; border-radius: 8px; text-align: center; margin: 25px 0;">
                  <span style="color: white; font-size: 28px; font-weight: bold; letter-spacing: 8px;">${code}</span>
                </div>

                <p style="color: #555; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
                <p style="color: #555; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
                <p>© 2023 ConstructHub.ai. All rights reserved.</p>
                <p>If you have any questions, please contact our support team.</p>
              </div>
            </div>
          `,
        },
      ],
    });

    return result.body;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendAdminVerificationEmail = async (
  adminEmail: string,
  requestingEmail: string,
  verificationLink: string
) => {
  try {
    console.log('Mailjet API Key:', process.env.MAILJET_API_KEY ? 'Set' : 'Not set');
    console.log('Mailjet API Secret:', process.env.MAILJET_API_SECRET ? 'Set' : 'Not set');
    console.log('Sending admin verification email to:', adminEmail);
    console.log('From requesting email:', requestingEmail);
    console.log('With verification link:', verificationLink);

    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "jeshwar2009@gmail.com",
            Name: 'ConstructHub.ai',
          },
          To: [
            {
              Email: adminEmail,
              Name: 'Admin',
            },
          ],
          Subject: 'Admin Registration Request - ConstructHub.ai',
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; padding: 10px 20px; background: linear-gradient(to right, #A855F7, #EC4899); border-radius: 50px; margin-bottom: 10px;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">ConstructHub.ai</h1>
                </div>
                <h2 style="color: #333; margin: 10px 0;">Admin Registration Request</h2>
              </div>

              <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p style="color: #555; font-size: 16px;">Hello <strong>Admin</strong>,</p>
                <p style="color: #555; font-size: 16px;">A new admin registration request has been received from:</p>

                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; margin: 25px 0; border-left: 4px solid #A855F7;">
                  <span style="color: #333; font-size: 18px; font-weight: bold;">${requestingEmail}</span>
                </div>

                <p style="color: #555; font-size: 16px;">To approve this request, please click the button below:</p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #A855F7, #EC4899); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3); transition: all 0.3s ease;">
                    Approve Admin Request
                  </a>
                </div>

                <p style="color: #555; font-size: 14px;">If you did not expect this request, you can safely ignore this email.</p>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
                <p>© 2023 ConstructHub.ai. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          `,
        },
      ],
    });

    console.log('Mailjet API response:', JSON.stringify(result.body, null, 2));
    return result.body;
  } catch (error) {
    console.error('Error sending admin verification email:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

export default {
  sendVerificationEmail,
  sendAdminVerificationEmail,
};
