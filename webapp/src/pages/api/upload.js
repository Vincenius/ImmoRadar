import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// https://api.ionos.com/docs/object-storage-user-owned-buckets/v2/#section/Overview

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '20mb'
      }
  }
}

const getOptions = body => ({
  method: 'POST',
  headers: {
    'xc-token': process.env.NOCODB_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})

const s3 = new S3Client({
  region: process.env.IONOS_S3_REGION,
  endpoint: 'https://s3.eu-central-2.ionoscloud.com',
  credentials: {
    accessKeyId: process.env.IONOS_S3_KEY,
    secretAccessKey: process.env.IONOS_S3_SECRET,
  },
});

const handleUpload = async file => {
  const { image, fileName, mimeType } = file;
  const base64Data = Buffer.from(image.split(',')[1], 'base64');

  const fileKey = `uploads/${Date.now()}-${fileName}`

  const params = {
    Bucket: process.env.IONOS_S3_BUCKET,
    Key: fileKey,
    Body: base64Data,
    ContentType: mimeType,
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  return `https://s3.eu-central-2.ionoscloud.com/${process.env.IONOS_S3_BUCKET}/${fileKey}`
}

export default async function handler(req, res) {
  if (req.body.api_key !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    const { files, recordId, linkId, tableId } = req.body;
    console.log({
      recordId, linkId, tableId
    })

    const fileIds = await Promise.all(files.map(async file => {
      const fileUrl = await handleUpload(file)
      const fileOptions = getOptions({
        Filename: file.fileName,
        Url: fileUrl,
      })
      const newFile = await fetch('https://admin.immoradar.xyz/api/v2/tables/mp3txseo70f4win/records', fileOptions).then(res => res.json())

      return { Id: newFile.Id }
    }))

    const linkOptions = getOptions(fileIds)
    await fetch(`https://admin.immoradar.xyz/api/v2/tables/${tableId}/links/${linkId}/records/${recordId}`, linkOptions)
      .then(res => res.json())

    res.status(200).json({ message: 'File uploaded successfully' });
  }
}