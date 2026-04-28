const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});



exports.sendResetPasswordEmail = async (options) => {
    try{

        const mailOptions = {
            from: 'Task-Manger <ahmed.selim@example.com>', // sender address
            to: options.email, 
            subject: options.subject,
            text: options.message
        };
        
        await transporter.sendMail(mailOptions);
    }

    catch(err){
        console.log(err);
        throw (err);
    }
};

