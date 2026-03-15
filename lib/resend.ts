import { Resend } from 'resend';
import { render } from '@react-email/render';
import ReservationConfirmedEmail from '@/lib/emails/reservation-confirmed';
import * as React from 'react';

export const resend = new Resend(process.env.RESEND_API_KEY);

interface SendReservationEmailProps {
    to: string;
    customerName: string;
    reservationNumber: string;
    vehicleName: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    total: string;
}

export const sendReservationConfirmedEmail = async (props: SendReservationEmailProps) => {
    try {
        const html = await render(
            React.createElement(ReservationConfirmedEmail, {
                customerName: props.customerName,
                reservationNumber: props.reservationNumber,
                vehicleName: props.vehicleName,
                pickupDate: props.pickupDate,
                returnDate: props.returnDate,
                pickupLocation: props.pickupLocation,
                total: props.total,
            })
        );

        const { data, error } = await resend.emails.send({
            from: 'CarCo <info@taskmasters.site>',
            to: [props.to],
            subject: 'Su Reserva Está Confirmada — CarCo',
            html,
        });

        if (error) {
            console.error('Error sending reservation email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Exception in sendReservationConfirmedEmail:', error);
        return { success: false, error };
    }
};
