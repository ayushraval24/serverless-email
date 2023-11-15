const nodeMailer = require("nodemailer");
const { isBase64 } = require("./utils/email");

module.exports.handler = async event => {
  try {
    const data = JSON.parse(event.body);

    const { email, subject, htmlBody, attachments } = data;

    console.log("DATA: ", email);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Email id is required",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    if (attachments && attachments.length) {
      if (attachments.length > 0) {
        attachments.forEach(attachment => {
          if (!isBase64(attachment.content)) {
            return {
              statusCode: 400,
              body: JSON.stringify({
                message:
                  "Attachment format should be array of filename:String and content:Base64",
              }),
              headers: {
                "Content-Type": "application/json",
              },
            };
          }
        });
      } else {
        if (!isBase64(attachments[0].content)) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              message:
                "Attachment format should be array of filename:String and content:Base64",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          };
        }
      }
    }

    const transporter = nodeMailer.createTransport({
      service: process.env.NODEMAILER_SERVICE,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: subject,
      html: htmlBody,
      attachments: attachments,
    };

    if (!attachments) {
      delete mailOptions.attachments;
    }

    const response = await transporter.sendMail(mailOptions);
    console.log("RES: ", response);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Email sent successfully to ${email}`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    console.log("Error: ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong in sending email",
        error: err,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
