import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const emojis = {
  'pdf': '📄',
  'docx': '📄',
  'xlsx': '📊',
  'jpg': '🖼️',
  'png': '🖼️',
};

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const ID_CANAL = process.env.ID_CANAL;

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = '/tmp';
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error al procesar el archivo' });
      return;
    }

    const file = files.documento;
    const filePath = file[0].filepath;
    const fileName = file[0].originalFilename;
    const fileExt = fileName.split('.').pop().toLowerCase();
    const emoji = emojis[fileExt] || '📁';

    const formData = new FormData();
    formData.append('chat_id', ID_CANAL);
    formData.append('caption', `${emoji} ${fileName}`);
    formData.append('document', new Blob([fs.readFileSync(filePath)]));

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData
    });

    res.status(200).json({ mensaje: 'Archivo enviado con éxito' });
  });
}
