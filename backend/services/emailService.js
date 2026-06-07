const nodemailer=require('nodemailer');
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

const sendOtpEmail=async(toEmail, otp)=>{
    const mailOptions={
        from: `"UniConnect" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your UniConnect Registration OTP',
        html: 
        `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 24px; font-weight: 700;">U</span>
          </div>
          <h1 style="color: #0f172a; font-size: 22px; margin-top: 14px; margin-bottom: 4px;">Verify Your Email</h1>
          <p style="color: #64748b; font-size: 14px;">Use the OTP below to complete your registration</p>
        </div>
        <div style="background: white; border-radius: 14px; padding: 28px; text-align: center; border: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 13px; margin-bottom: 16px;">Your One-Time Password</p>
          <div style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #2563eb; margin: 8px 0 16px;">
            ${otp}
          </div>
          <p style="color: #94a3b8; font-size: 12px;">This OTP expires in <strong>5 minutes</strong></p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
        `,
    };
    await transporter.sendMail(mailOptions);
}

module.exports={sendOtpEmail};