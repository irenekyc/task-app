const sgMail = require ('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{
    sgMail.send(
        {
            to: email,
            from: 'irenekayuc@gmail.com',
            subject: 'Thanks for joining in',
            text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
        }
    )
}

const sendCancellationEmail = (email, name)=> {
    sgMail.send({
        to: email,
        from: 'irenekayuc@gmail.com',
        subject: `It is sad to let you go, ${name}`,
        html: `<h1> Sad </h1>
        <h2> Hope you will join us later</h2>`
    })
}

module.exports = {
    sendWelcomeEmail, sendCancellationEmail
}