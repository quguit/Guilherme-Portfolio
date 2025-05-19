
require('dotenv').config();

const nodemailer = require('nodemailer');

async function sendTestMail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER, // envia pra você mesmo
    subject: 'Teste de Nodemailer',
    text: 'Este é um e-mail de teste enviado com Nodemailer usando Gmail.',
  };
  console.log('User:', process.env.MAIL_USER);
  console.log('Pass:', process.env.MAIL_PASS);


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado:', info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}

sendTestMail();
