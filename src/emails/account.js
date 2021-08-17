const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'akshaychandwani34@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app ${name}, Let me know how you get along with the app`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'akshaychandwani34@gmail.com',
        subject: 'We are sorry to see you Go',
        text: "Hope to see you soon, do reply with a feedback"
    })
}

module.exports = { 
    sendWelcomeEmail,
    sendCancelEmail
};