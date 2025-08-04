import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({ keepExtensions: true });
  form.uploadDir = path.join(process.cwd(), '/tmp');
  if (!fs.existsSync(form.uploadDir)) fs.mkdirSync(form.uploadDir);

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file[0];
    const filePath = file.filepath;
    const fileName = file.originalFilename;
    const fileExt = path.extname(fileName);
    const date = new Date().toLocaleDateString();

    const emojis = {
      '.pdf': '📄',
      '.docx': '📝',
      '.xlsx': '📊',
      '.jpg': '📷',
      '.png': '📷',
    };

    const emoji = emojis[fileExt.toLowerCase()] || '📁';

    const telegramUrl = \`https://api.telegram.org/bot\${TELEGRAM_TOKEN}/sendDocument\`;

    const formData = new FormData();
    formData.append('chat_id', CHANNEL_ID);
    formData.append('document', fs.createReadStream(filePath), fileName);
    formData.append('caption', \`\${emoji} \${fileName}\n🗓️ \${date}\`);

    await fetch(telegramUrl, {
      method: 'POST',
      body: formData,
    });

    res.status(200).json({
      name: fileName,
      type: fileExt,
      emoji,
      date,
      url: '#',
    });
  });
}