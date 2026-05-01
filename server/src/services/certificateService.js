const PDFDocument = require('pdfkit');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

const generateCertificatePDF = async (userName, courseTitle, completionDate) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
    const chunks = [];
    
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#FAFAFA');
    
    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).stroke('#5C5FEF');
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(1).stroke('#5C5FEF');

    // Header
    doc.fillColor('#5C5FEF').fontSize(48).font('Helvetica-Bold').text('CERTIFICATE', 0, 80, { align: 'center' });
    doc.fillColor('#333').fontSize(18).font('Helvetica').text('OF COMPLETION', 0, 135, { align: 'center' });

    // Decorative line
    doc.moveTo(150, 170).lineTo(doc.page.width - 150, 170).lineWidth(2).stroke('#F59E0B');

    // "This is to certify that"
    doc.fillColor('#666').fontSize(14).font('Helvetica').text('This is to certify that', 0, 200, { align: 'center' });

    // Student Name
    doc.fillColor('#5C5FEF').fontSize(36).font('Helvetica-Bold').text(userName, 0, 230, { align: 'center' });

    // "has successfully completed"
    doc.fillColor('#666').fontSize(14).font('Helvetica').text('has successfully completed the course', 0, 285, { align: 'center' });

    // Course Title
    doc.fillColor('#333').fontSize(28).font('Helvetica-Bold').text(courseTitle, 0, 315, { align: 'center', lineGap: 10 });

    // Date
    const formattedDate = new Date(completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.fillColor('#666').fontSize(12).font('Helvetica').text(`Completed on ${formattedDate}`, 0, 380, { align: 'center' });

    // Signature area
    doc.moveTo(100, 420).lineTo(250, 420).lineWidth(1).stroke('#333');
    doc.fontSize(10).text('Instructor', 100, 430, { align: 'center' });
    doc.moveTo(doc.page.width - 250, 420).lineTo(doc.page.width - 100, 420).lineWidth(1).stroke('#333');
    doc.text('Platform Director', doc.page.width - 250, 430, { align: 'center' });

    // Badge
    doc.circle(doc.page.width / 2, 480, 30).fill('#5C5FEF');
    doc.fillColor('#FFF').fontSize(24).text('✓', doc.page.width / 2 - 10, 470, { align: 'center' });

    doc.end();
  });
};

const uploadToCloudinary = async (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', public_id: publicId, format: 'pdf' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const generateAndSaveCertificate = async (enrollment) => {
  try {
    const user = enrollment.user;
    const course = enrollment.course;
    
    // Generate PDF
    const pdfBuffer = await generateCertificatePDF(
      user.name,
      course.title,
      enrollment.completedAt || new Date()
    );

    // Upload to Cloudinary
    const publicId = `certificates/${user._id}_${course._id}_${Date.now()}`;
    const uploadResult = await uploadToCloudinary(pdfBuffer, publicId);
    
    logger.info(`Certificate generated: ${uploadResult.secure_url}`);
    return uploadResult.secure_url;
  } catch (error) {
    logger.error('Certificate generation failed:', error);
    throw error;
  }
};

module.exports = { generateAndSaveCertificate };