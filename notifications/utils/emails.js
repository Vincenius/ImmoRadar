import aws from '@aws-sdk/client-ses';
import nodemailer from 'nodemailer'

const ses = new aws.SES({
    region: 'eu-central-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        SES: { ses, aws },
    })

    const result = await transporter.sendMail({
        from: 'ImmoRadar <updates@fertighausradar.de>',
        to: `${to} <${to}>`,
        subject,
        html,
    })
    
    return result;
};

export default sendEmail;
