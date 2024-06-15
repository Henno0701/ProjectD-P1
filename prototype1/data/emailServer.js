const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
        user: 'projectdmailserver@gmail.com.com', // Your email
        pass: 'HopenDatDitWerkt' // Your email password
    }
});

app.post('/sendEmail', (req, res) => {
    const { email, subject, text } = req.body;

    const mailOptions = {
        from: 'projectdmailserver@gmail.com',
        to: 'j.goncalves0908@gmail.com',
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(port, () => {
    console.log(`Email server listening at http://localhost:${port}`);
});
