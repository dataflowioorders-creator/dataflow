import nodemailer from 'nodemailer';

// Helper to get transporter
const getTransporter = async () => {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Ethereal Dev Fallback
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

// Send Order Notification Email
export const sendOrderEmailNotification = async (order) => {
  try {
    const transporter = await getTransporter();
    const receiverEmail = process.env.RECEIVER_EMAIL || 'admin@dataflow.io';

    const htmlTemplate = `
      <div style="background-color: #0b071e; color: #cbd5e1; font-family: sans-serif; padding: 24px; border: 1px solid #3b0764; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <div style="border-bottom: 2px solid #a855f7; padding-bottom: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
          <h2 style="color: #ffffff; margin: 0; font-family: 'Orbitron', sans-serif; letter-spacing: 2px;">DATA FLOW</h2>
          <span style="color: #06b6d4; font-size: 11px; text-transform: uppercase; font-weight: bold; font-family: monospace;">New Order Alert</span>
        </div>

        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
          A new custom project order request has been received on the DATA FLOW grid. Please inspect details below.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px;">
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase; width: 140px;">Order ID:</td>
            <td style="padding: 10px 0; color: #ffffff; font-family: monospace;">${order._id}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase;">Customer Name:</td>
            <td style="padding: 10px 0; color: #ffffff;">${order.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase;">Email Address:</td>
            <td style="padding: 10px 0; color: #06b6d4;">${order.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase;">Phone Uplink:</td>
            <td style="padding: 10px 0; color: #ffffff;">${order.phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase;">Service Node:</td>
            <td style="padding: 10px 0; color: #ffffff; font-weight: bold;">${order.service}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase;">Proposed Budget:</td>
            <td style="padding: 10px 0; color: #06b6d4; font-weight: bold;">${order.budget}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase;">Target Deadline:</td>
            <td style="padding: 10px 0; color: #ffffff;">${new Date(order.deadline).toLocaleDateString()}</td>
          </tr>
          ${order.fileUrl ? `
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase;">Attachment:</td>
            <td style="padding: 10px 0; color: #06b6d4;"><a href="http://localhost:5000${order.fileUrl}" style="color: #06b6d4; text-decoration: underline;">${order.fileName || 'Download File'}</a></td>
          </tr>
          ` : ''}
        </table>

        <div style="background-color: #02000a; border: 1px solid #1e1b4b; padding: 14px; border-radius: 4px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; color: #a855f7; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Project Scope Specifications:</h4>
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${order.description}</p>
        </div>

        <div style="text-align: center;">
          <a href="http://localhost:5173/admin" style="background-color: #06b6d4; color: #02000a; text-decoration: none; padding: 10px 24px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1.5px; display: inline-block;">
            Open Control Grid Dashboard
          </a>
        </div>

        <div style="border-top: 1px solid #1e1b4b; margin-top: 30px; padding-top: 12px; text-align: center; font-size: 10px; color: #475569;">
          This transmission is automated by DATA FLOW Mail Node System.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"DATA FLOW Mail Node" <${transporter.options.auth.user}>`,
      to: receiverEmail,
      subject: `[NEW PROJECT ORDER] ${order.service} - ${order.name}`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Mailer Node: Order email dispatched successfully.');
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Mailer Node: Click link below to view order transmission preview:');
      console.log(previewUrl);
    }
  } catch (error) {
    console.error('Mailer Node: Error transmitting order email:', error.message);
  }
};

// Send OTP Verification Email
export const sendOTPEmailNotification = async (email, otp) => {
  try {
    const transporter = await getTransporter();

    const htmlTemplate = `
      <div style="background-color: #0b071e; color: #cbd5e1; font-family: sans-serif; padding: 32px 24px; border: 1px solid #3b0764; border-radius: 8px; max-width: 500px; margin: 0 auto; text-align: center;">
        <h2 style="color: #ffffff; margin: 0 0 10px 0; font-family: 'Orbitron', sans-serif; letter-spacing: 3px;">DATA FLOW</h2>
        <div style="width: 60px; height: 2px; background: linear-gradient(to right, #a855f7, #06b6d4); margin: 0 auto 24px auto;"></div>
        
        <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Security Protocol Verification. Use the temporary access code below to verify your email address and authorize your account grid.
        </p>

        <div style="background-color: #02000a; border: 1px solid #3b0764; padding: 18px 24px; border-radius: 6px; display: inline-block; margin-bottom: 24px;">
          <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #06b6d4;">${otp}</span>
        </div>

        <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
          This code is only active for 5 minutes. If you did not initialize this request, please disregard this alert transmission.
        </p>
        
        <div style="border-top: 1px solid #1e1b4b; margin-top: 30px; padding-top: 12px; font-size: 10px; color: #475569;">
          This is an automated system confirmation from the DATA FLOW Security Matrix.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"DATA FLOW Security" <${transporter.options.auth.user}>`,
      to: email,
      subject: `[DATA FLOW] Email Verification OTP: ${otp}`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Mailer Node: OTP code ${otp} sent to ${email}.`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Mailer Node: Click link below to view OTP transmission preview for ${email}:`);
      console.log(previewUrl);
    }
  } catch (error) {
    console.error('Mailer Node: Error transmitting OTP email:', error.message);
  }
};

// Send Contact Form Email to Admin
export const sendContactEmailNotification = async ({ name, email, message }) => {
  try {
    const transporter = await getTransporter();
    const receiverEmail = process.env.RECEIVER_EMAIL || 'dataflow.io.orders@gmail.com';

    const htmlTemplate = `
      <div style="background-color: #0b071e; color: #cbd5e1; font-family: sans-serif; padding: 24px; border: 1px solid #3b0764; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <div style="border-bottom: 2px solid #a855f7; padding-bottom: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
          <h2 style="color: #ffffff; margin: 0; font-family: 'Orbitron', sans-serif; letter-spacing: 2px;">DATA FLOW</h2>
          <span style="color: #06b6d4; font-size: 11px; text-transform: uppercase; font-weight: bold; font-family: monospace;">New Contact Message</span>
        </div>

        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
          A visitor has submitted a contact message through the DATA FLOW website.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px;">
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase; width: 120px;">Name:</td>
            <td style="padding: 10px 0; color: #ffffff;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e1b4b;">
            <td style="padding: 10px 0; font-weight: bold; color: #a855f7; text-transform: uppercase;">Email:</td>
            <td style="padding: 10px 0; color: #06b6d4;">${email}</td>
          </tr>
        </table>

        <div style="background-color: #02000a; border: 1px solid #1e1b4b; padding: 14px; border-radius: 4px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; color: #a855f7; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Message:</h4>
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="text-align: center;">
          <a href="mailto:${email}" style="background-color: #06b6d4; color: #02000a; text-decoration: none; padding: 10px 24px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1.5px; display: inline-block;">
            Reply to ${name}
          </a>
        </div>

        <div style="border-top: 1px solid #1e1b4b; margin-top: 30px; padding-top: 12px; text-align: center; font-size: 10px; color: #475569;">
          This transmission is automated by DATA FLOW Mail Node System.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"DATA FLOW Contact" <${transporter.options.auth.user}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `[CONTACT MESSAGE] ${name} — via DATA FLOW Website`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Mailer Node: Contact message from ${name} (${email}) dispatched to admin.`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Mailer Node: Contact email preview:', previewUrl);
    }
  } catch (error) {
    console.error('Mailer Node: Error transmitting contact email:', error.message);
  }
};
