import nodemailer from 'nodemailer';
import { SETTINGS } from '../settings/settings';

export const nodemailerService = {
    sendEmail: async (email: string, subject: string, message: string,): Promise<boolean> => {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SETTINGS.GMAIL_EMAIL_FROM,
                pass: SETTINGS.GMAIL_PASSWORD,
            },
        });

        await transport.verify();

        console.log('Connection verified successfully');

        const info = await transport.sendMail({
            from: `Nastushka <${SETTINGS.GMAIL_EMAIL_FROM}>`,
            subject: subject,
            to: email,
            html: message,
        });

        console.log('sendMail info', info);

        return !!info;
    }
}