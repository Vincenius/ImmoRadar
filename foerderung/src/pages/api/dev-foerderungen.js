import fs from 'fs';
import path from 'path';
import generatePdf from '@/utils/generateSubsidyPdf';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET' && process.env.STAGE !== 'prod') {
      // Replace with actual parameters if needed
      const { filename } = await generatePdf('all', { Name: 'Test' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filename)}`);

      const fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);

      // Delete the file after sending
      fileStream.on('end', () => {
        fs.unlink(filename, (err) => {
          if (err) console.error('Failed to delete file:', err);
        });
      });

      fileStream.on('error', (err) => {
        console.error('File stream error:', err);
        res.status(500).end();
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
