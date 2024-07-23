import AWS from 'aws-sdk';

const sendEmail = async ({ to, subject, text }) => {
    try {
        // Configure AWS SES
        AWS.config.update({
            region: 'eu-central-1',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        const ses = new AWS.SES({ apiVersion: '2010-12-01' });

        // Send email
        const result = await ses.sendEmail({
            Source: 'updates@immoradar.xyz',
            Destination: {
                ToAddresses: to
            },
            Message: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Text: {
                        Data: text
                    }
                }
            }
        }).promise();
        console.log('Email sent:', result.MessageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;
