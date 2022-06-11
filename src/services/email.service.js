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

const sendEmail = async (to, subject, html, text) => {
  const msg = { from: config.email.from, to, subject, html, text };
  await transport.sendMail(msg);
};

exports.sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  const html = pug.renderFile(`${__dirname}/../views/email/passwordReset.pug`, {
    firstName: to,
    url: resetPasswordUrl,
    subject,
  });

  await sendEmail(to, subject, html, text);
};

exports.sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

exports.sendQrCodeEmail = async (to, code) => {
  const subject = 'QR Code for Attendance:';
  const text = `Dear user,
Your QR Code is for Attendance`;
  const html = pug.renderFile(`${__dirname}/../views/email/qrCode.pug`, {
    name: to,
    url: `https://chart.apis.google.com/chart?cht=qr&chs=256x256&chl=${code}`,
    subject,
  });

  await sendEmail(to, subject, html, text);
};
