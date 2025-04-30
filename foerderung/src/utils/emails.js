import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import fs from 'fs';

export const sendEmail = async ({ to, subject, html, pdfFilePath, pdfFileName }) => {
    AWS.config.update({
        apiVersion: '2010-12-01',
        region: 'eu-central-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const transporter = nodemailer.createTransport({
        SES: new AWS.SES()
    });

    const attachments = pdfFilePath ? [{
        filename: pdfFileName,
        content: fs.createReadStream(pdfFilePath)
    }] : [];

    const result = await transporter.sendMail({
        from: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} <noreply@immoradar.xyz>`,
        to: `${to} <${to}>`,
        subject,
        html,
        attachments
    });
    
    return result;
};

export default sendEmail;
