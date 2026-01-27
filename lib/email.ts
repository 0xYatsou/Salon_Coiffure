/**
 * Email notification service
 * In production, use a service like SendGrid, Mailgun, or AWS SES
 */

interface EmailData {
    to: string;
    subject: string;
    html: string;
}

interface BookingConfirmation {
    clientName: string;
    clientEmail: string;
    serviceName: string;
    date: string;
    time: string;
    price: number;
}

interface BookingReminder {
    clientName: string;
    clientEmail: string;
    serviceName: string;
    date: string;
    time: string;
}

/**
 * Send an email (mock implementation)
 * Replace with actual email service in production
 */
export async function sendEmail(data: EmailData): Promise<boolean> {
    console.log("📧 Email sent to:", data.to);
    console.log("   Subject:", data.subject);

    // In production, integrate with email service here
    // Example with SendGrid:
    // await sgMail.send({
    //     to: data.to,
    //     from: 'salon@salonpremium.fr',
    //     subject: data.subject,
    //     html: data.html,
    // });

    return true;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(booking: BookingConfirmation): Promise<boolean> {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f4;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #0c0a09 0%, #292524 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #d4af37; margin: 0; font-size: 28px; font-weight: 600;">Salon Premium</h1>
                        <p style="color: #d6d3d1; margin: 10px 0 0;">Confirmation de réservation</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px;">
                        <h2 style="color: #0c0a09; margin: 0 0 20px; font-size: 24px;">Bonjour ${booking.clientName} !</h2>
                        
                        <p style="color: #57534e; line-height: 1.6; margin: 0 0 30px;">
                            Votre rendez-vous a bien été enregistré. Nous avons hâte de vous accueillir !
                        </p>
                        
                        <!-- Booking Details Card -->
                        <div style="background-color: #f5f5f4; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #78716c;">Prestation</td>
                                    <td style="padding: 8px 0; color: #0c0a09; font-weight: 600; text-align: right;">${booking.serviceName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #78716c;">Date</td>
                                    <td style="padding: 8px 0; color: #0c0a09; font-weight: 600; text-align: right;">${booking.date}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #78716c;">Heure</td>
                                    <td style="padding: 8px 0; color: #0c0a09; font-weight: 600; text-align: right;">${booking.time}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0 0; color: #78716c; border-top: 1px solid #d6d3d1;">Prix</td>
                                    <td style="padding: 12px 0 0; color: #d4af37; font-weight: 700; font-size: 20px; text-align: right; border-top: 1px solid #d6d3d1;">${booking.price}€</td>
                                </tr>
                            </table>
                        </div>
                        
                        <p style="color: #78716c; font-size: 14px; line-height: 1.6; margin: 0;">
                            📍 <strong>Adresse :</strong> 123 Rue Example, 75001 Paris<br>
                            📞 <strong>Téléphone :</strong> 01 23 45 67 89
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f5f5f4; padding: 24px; text-align: center;">
                        <p style="color: #78716c; font-size: 12px; margin: 0;">
                            © 2026 Salon Premium. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail({
        to: booking.clientEmail,
        subject: `✅ Confirmation - Rendez-vous le ${booking.date} à ${booking.time}`,
        html,
    });
}

/**
 * Send booking reminder (24h before)
 */
export async function sendBookingReminder(booking: BookingReminder): Promise<boolean> {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f4;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="background: linear-gradient(135deg, #0c0a09 0%, #292524 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #d4af37; margin: 0; font-size: 28px;">⏰ Rappel</h1>
                        <p style="color: #d6d3d1; margin: 10px 0 0;">Votre rendez-vous approche !</p>
                    </div>
                    
                    <div style="padding: 40px;">
                        <h2 style="color: #0c0a09; margin: 0 0 20px;">Bonjour ${booking.clientName} !</h2>
                        
                        <p style="color: #57534e; line-height: 1.6;">
                            Ceci est un rappel pour votre rendez-vous <strong>demain</strong> :
                        </p>
                        
                        <div style="background-color: #f5f5f4; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center;">
                            <p style="color: #d4af37; font-size: 24px; font-weight: 700; margin: 0 0 8px;">${booking.serviceName}</p>
                            <p style="color: #0c0a09; font-size: 18px; margin: 0;">${booking.date} à ${booking.time}</p>
                        </div>
                        
                        <p style="color: #78716c; font-size: 14px;">
                            Nous vous attendons au 123 Rue Example, 75001 Paris.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail({
        to: booking.clientEmail,
        subject: `⏰ Rappel - Rendez-vous demain à ${booking.time}`,
        html,
    });
}

/**
 * Send cancellation notification
 */
export async function sendBookingCancellation(
    clientEmail: string,
    clientName: string,
    date: string,
    time: string
): Promise<boolean> {
    const html = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 40px; background-color: #f5f5f4;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px;">
                <h1 style="color: #0c0a09;">Annulation confirmée</h1>
                <p>Bonjour ${clientName},</p>
                <p>Votre rendez-vous du ${date} à ${time} a bien été annulé.</p>
                <p>Nous espérons vous revoir bientôt !</p>
                <p style="color: #78716c;">L'équipe Salon Premium</p>
            </div>
        </body>
        </html>
    `;

    return sendEmail({
        to: clientEmail,
        subject: "Annulation de votre rendez-vous",
        html,
    });
}
