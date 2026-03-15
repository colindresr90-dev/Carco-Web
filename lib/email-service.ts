import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as React from 'react';

// Import email components
import ReservationConfirmedEmail from '@/lib/emails/reservation-confirmed';
import ReservationCancelledEmail from '@/lib/emails/reservation-cancelled';
import PaymentInvoiceEmail from '@/lib/emails/payment-invoice';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'CarCo <info@taskmasters.site>';

// Interfaces for email props
export interface SendReservationEmailProps {
    to: string;
    customerName: string;
    reservationNumber: string;
    vehicleName: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    total: string;
}

export interface SendReservationCancelledProps {
    to: string;
    customerName: string;
    reservationNumber: string;
    vehicleName: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    refundAmount?: number;
    cancellationReason?: string;
}

export interface SendPaymentInvoiceProps {
    to: string;
    customerName: string;
    reservationId: string;
    vehicleName: string;
    pickupDate: string;
    returnDate: string;
    subtotal: string;
    taxes: string;
    total: string;
    paymentMethod: string;
}

/**
 * Sends a confirmation email for a new reservation
 */
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
            from: FROM_EMAIL,
            to: [props.to],
            subject: 'Su Reserva Está Confirmada — CarCo',
            html,
        });

        if (error) {
            console.error('Error sending reservation confirmed email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Exception in sendReservationConfirmedEmail:', error);
        return { success: false, error };
    }
};

/**
 * Sends a cancellation email for a reservation
 */
export const sendReservationCancelledEmail = async (props: SendReservationCancelledProps) => {
    try {
        const html = await render(
            React.createElement(ReservationCancelledEmail, {
                customerName: props.customerName,
                reservationNumber: props.reservationNumber,
                vehicleName: props.vehicleName,
                pickupDate: props.pickupDate,
                returnDate: props.returnDate,
                pickupLocation: props.pickupLocation,
                refundAmount: props.refundAmount,
                cancellationReason: props.cancellationReason,
            })
        );

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [props.to],
            subject: 'Su Reserva Ha Sido Cancelada — CarCo',
            html,
        });

        if (error) {
            console.error('Error sending reservation cancelled email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Exception in sendReservationCancelledEmail:', error);
        return { success: false, error };
    }
};

/**
 * Sends a payment invoice email
 */
export const sendPaymentInvoiceEmail = async (props: SendPaymentInvoiceProps) => {
    try {
        const html = await render(
            React.createElement(PaymentInvoiceEmail, {
                customerName: props.customerName,
                reservationId: props.reservationId,
                vehicleName: props.vehicleName,
                pickupDate: props.pickupDate,
                returnDate: props.returnDate,
                subtotal: props.subtotal,
                taxes: props.taxes,
                total: props.total,
                paymentMethod: props.paymentMethod,
            })
        );

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [props.to],
            subject: `Confirmación de Pago — Reserva #${props.reservationId}`,
            html,
        });

        if (error) {
            console.error('Error sending payment invoice email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Exception in sendPaymentInvoiceEmail:', error);
        return { success: false, error };
    }
};
