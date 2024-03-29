const nodemailer = require('nodemailer');
const pug = require('pug');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('🟢 Connected to email server'))
    .catch(() => logger.warn('🔴 Unable to connect to email server'));
}

// const sendEmail = async (to, subject, html, text, attachments) => {
//   const msg = { from: config.email.from, to, subject, html, text, attachments };
//   await transport.sendMail(msg);
// };
const sendEmail = async (to, subject, html, text) => {
  const msg = { from: config.email.from, to, subject, html, text };
  await transport.sendMail(msg);
};

exports.sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear User,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  const html = pug.renderFile(`${__dirname}/../views/email/passwordReset.pug`, {
    name: to,
    url: resetPasswordUrl,
    subject,
  });

  await sendEmail(to, subject, html, text);
};

exports.sendVerificationEmail = async (to, name, token) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear ${name},
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

exports.sendQrCodeEmail = async (to, name, code) => {
  const subject = 'Thank you for registering for De-Code';
  const text = `Dear ${name},
Your QR Code for Attendance`;
  const html = pug.renderFile(`${__dirname}/../views/email/qrCode.pug`, {
    name,
    url: `https://chart.apis.google.com/chart?cht=qr&chs=256x256&chl=${code}`,
    subject,
  });

  await sendEmail(to, subject, html, text);
};

exports.sendMiscMail = async (to, name) => {
  const subject = "Regardin E-Certificates and OD's for DE-CODE";
  const text = `Dear ${name},
  Details on E-Certificates and OD's for DE-CODE`;
  const html = pug.renderFile(`${__dirname}/../views/email/miscMail.pug`, {
    name,
    subject,
  });

  await sendEmail(to, subject, html, text);
};

exports.sendCertificateMail = async (to, name) => {
  const subject = 'Regarding Second round of Recruitments';
  // const attachments = [
  //   {
  //     filename: `${to}.jpg`,
  //     path: `/run/media/panic0/Harddrive/blockchain_club_Srm/Print-Names-in-Certificate-using-Python/out/${to}.jpg`,
  //     contentType: 'image/jpg',
  //   },
  // ];
  const text = `Dear ${name},
  Regarding Second round of Recruitments
  Book Your Slot Here - https://calendly.com/blockchainclubsrm/recruitments-technical `;
  const html = pug.renderFile(`${__dirname}/../views/email/congrats.pug`, {
    name,
    subject,
  });

  await sendEmail(to, subject, html, text);
};
