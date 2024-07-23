import AWS from 'aws-sdk';
import nodemailer from 'nodemailer'

export const sendEmail = async ({ to, subject, html }) => {
    AWS.config.update({
        apiVersion: '2010-12-01',
        region: 'eu-central-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const transporter = nodemailer.createTransport({
        SES: new AWS.SES()
    })

    const result = await transporter.sendMail({
        from: 'ImmoRadar <updates@immoradar.xyz>',
        to: `${to} <${to}>`,
        subject,
        html,
    })
    
    return result;
};

export default sendEmail;
