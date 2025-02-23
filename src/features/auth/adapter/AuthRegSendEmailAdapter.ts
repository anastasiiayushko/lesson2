import {AuthRegSendEmailPort} from "../core/port/AuthRegSendEmailPort";
import nodemailer from "nodemailer";
import {SETTINGS} from "../../../settings";
import {injectable} from "inversify";

@injectable()
export class AuthRegSendEmailAdapter implements AuthRegSendEmailPort {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: SETTINGS.AUTH_GMAIL_USER,
                pass: SETTINGS.AUTH_GMAIL_PASS,
            },
        });
    }

    async confirmRegistration(emailTo: string, confirmedCode: string) {
        this.transporter.sendMail({
            from: '"Blogger Platform 👻" <dinaswebstudio2020@gmail.com>', // sender address
            to: emailTo, // list of receivers
            subject: "Confirmed registration to Blogger platform ✔", // Subject line
            html: ` <h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below:
                     <a href='https://somesite.com/confirm-email?code=${confirmedCode}'>complete registration</a>
                 </p>`,
        }).catch(e => {
            console.error('confirmRegistration', e.message)
        })
    }

    async recoveryPassword(emailTo: string, confirmedCode: string) {
        this.transporter.sendMail({
            from: '"Blogger Platform 👻" <dinaswebstudio2020@gmail.com>', // sender address
            to: emailTo, // list of receivers
            subject: "Password recovery to Blogger platform ✔", // Subject line
            html: `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${confirmedCode}'>recovery password</a>
      </p>`,
        }).catch(e => {
            console.error('recoveryPassword', e.message)
        })
    }

}