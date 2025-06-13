const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph } = require('docx');
const { exec } = require('child_process');

async function convertFile(inputPath, format) {
  const ext = path.extname(inputPath).slice(1).toLowerCase();
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join(path.dirname(inputPath), `${baseName}.${format}`);

  console.log("🔍 Detected file extension:", ext, "| Convert to:", format);
  console.log("📁 Input file path:", inputPath);

  // ✅ Enhanced image to PDF with .webp support
  if (format === 'pdf' && ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    console.log("🖼️ Converting image to PDF...");

    const pdfDoc = await PDFDocument.create();

    // Convert all images to PNG buffer using sharp
    const pngBuffer = await sharp(inputPath)
      .png()
      .toBuffer();

    const embeddedImage = await pdfDoc.embedPng(pngBuffer);
    const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
    page.drawImage(embeddedImage, { x: 0, y: 0, width: embeddedImage.width, height: embeddedImage.height });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    console.log("✅ Image to PDF conversion done.");
    return outputPath;
  }

  // DOCX → TXT
  if (ext === 'docx' && format === 'txt') {
    const result = await mammoth.extractRawText({ path: inputPath });
    fs.writeFileSync(outputPath, result.value || 'No content found');
    return outputPath;
  }

  // TXT → DOCX
  if (ext === 'txt' && format === 'docx') {
    const text = fs.readFileSync(inputPath, 'utf8');
    const doc = new Document({
      sections: [{ properties: {}, children: [new Paragraph(text)] }],
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
    return outputPath;
  }

  // DOCX → PDF
  if (ext === 'docx' && format === 'pdf') {
    const result = await mammoth.extractRawText({ path: inputPath });
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText(result.value || 'No content found', { x: 50, y: 700, size: 12 });
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    return outputPath;
  }

  // PDF → DOCX via Python
  if (ext === 'pdf' && format === 'docx') {
    return await convertPDFtoDOCX(inputPath, outputPath);
  }

  throw new Error('❌ This file type or conversion is not supported yet.');
}

function convertPDFtoDOCX(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const command = `python pdf_to_docx.py "${inputPath}" "${outputPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(`PDF to DOCX failed: ${stderr}`);
      }
      if (stdout.includes('success')) {
        return resolve(outputPath);
      } else {
        return reject(`PDF to DOCX failed: ${stdout}`);
      }
    });
  });
}

module.exports = { convertFile };
