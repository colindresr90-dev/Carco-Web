import * as React from 'react';
import {
    Section,
    Text,
    Row,
    Column,
    Button,
} from '@react-email/components';
import { BaseLayout } from './base-layout';

interface PaymentInvoiceProps {
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

export const PaymentInvoiceEmail = ({
    customerName = "Cliente",
    reservationId = "RES-123456",
    vehicleName = "Vehículo Premium",
    pickupDate = "10 de Octubre, 2026",
    returnDate = "15 de Octubre, 2026",
    subtotal = "$400.00",
    taxes = "$50.00",
    total = "$450.00",
    paymentMethod = "Tarjeta terminada en 4242",
}: PaymentInvoiceProps) => {
    return (
        <BaseLayout previewText={`Confirmación de Pago — Reserva #${reservationId}`}>
            <Section style={contentSection}>
                <Text style={headline}>
                    Confirmación de Pago
                </Text>
                <Text style={subtext}>
                    Hola {customerName}, hemos recibido su pago correctamente. A continuación encontrará el detalle de la transacción.
                </Text>

                <Section style={invoiceContainer}>
                    <Text style={detailsTitle}>Detalle de Transacción</Text>

                    <Row style={detailRow}>
                        <Column style={detailLabelColumn}>
                            <Text style={detailLabel}>Reserva ID</Text>
                        </Column>
                        <Column>
                            <Text style={detailValue}>{reservationId}</Text>
                        </Column>
                    </Row>

                    <Row style={detailRow}>
                        <Column style={detailLabelColumn}>
                            <Text style={detailLabel}>Vehículo</Text>
                        </Column>
                        <Column>
                            <Text style={detailValue}>{vehicleName}</Text>
                        </Column>
                    </Row>

                    <Row style={detailRow}>
                        <Column style={detailLabelColumn}>
                            <Text style={detailLabel}>Fechas</Text>
                        </Column>
                        <Column>
                            <Text style={detailValue}>{pickupDate} - {returnDate}</Text>
                        </Column>
                    </Row>

                    <Row style={detailRow}>
                        <Column style={detailLabelColumn}>
                            <Text style={detailLabel}>Método de Pago</Text>
                        </Column>
                        <Column>
                            <Text style={detailValue}>{paymentMethod}</Text>
                        </Column>
                    </Row>

                    <Section style={pricingSection}>
                        <Row style={pricingRow}>
                            <Column style={pricingLabelColumn}>
                                <Text style={detailLabel}>Subtotal</Text>
                            </Column>
                            <Column style={pricingValueColumn}>
                                <Text style={detailValue}>{subtotal}</Text>
                            </Column>
                        </Row>

                        <Row style={pricingRow}>
                            <Column style={pricingLabelColumn}>
                                <Text style={detailLabel}>Impuestos</Text>
                            </Column>
                            <Column style={pricingValueColumn}>
                                <Text style={detailValue}>{taxes}</Text>
                            </Column>
                        </Row>

                        <Row style={{ ...pricingRow, borderTop: '2px solid #111111', paddingTop: '15px', marginTop: '5px' }}>
                            <Column style={pricingLabelColumn}>
                                <Text style={{ ...detailLabel, fontWeight: '700', color: '#111111' }}>Total</Text>
                            </Column>
                            <Column style={pricingValueColumn}>
                                <Text style={detailTotal}>{total}</Text>
                            </Column>
                        </Row>
                    </Section>
                </Section>

                <Section style={buttonSection}>
                    <Button style={button} href="https://tudominio.com/reservations">
                        Ver Mis Reservas
                    </Button>
                </Section>
            </Section>
        </BaseLayout>
    );
};

export default PaymentInvoiceEmail;

const contentSection = {
    backgroundColor: '#FFFFFF',
    padding: '40px',
    borderRadius: '12px',
    border: '1px solid #E5E5E5',
};

const headline = {
    fontSize: '28px',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: '600',
    color: '#111111',
    margin: '0 0 15px 0',
    textAlign: 'center' as const,
};

const subtext = {
    fontSize: '16px',
    color: '#555555',
    lineHeight: '24px',
    margin: '0 0 30px 0',
    textAlign: 'center' as const,
};

const invoiceContainer = {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '0',
    marginBottom: '35px',
    borderTop: '2px solid #C6A14A',
};

const detailsTitle = {
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: '#888888',
    margin: '25px 0 20px 0',
    borderBottom: '1px solid #E5E5E5',
    paddingBottom: '10px',
};

const detailRow = {
    width: '100%',
    paddingBottom: '15px',
    marginBottom: '15px',
    borderBottom: '1px solid #EEEEEE',
};

const detailLabelColumn = {
    width: '40%',
    verticalAlign: 'top',
};

const detailLabel = {
    fontSize: '15px',
    color: '#777777',
    margin: '0',
};

const detailValue = {
    fontSize: '15px',
    color: '#111111',
    fontWeight: '500',
    margin: '0',
};

const pricingSection = {
    backgroundColor: '#F9F9F9',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
};

const pricingRow = {
    width: '100%',
    paddingBottom: '10px',
    marginBottom: '10px',
};

const pricingLabelColumn = {
    width: '60%',
    textAlign: 'right' as const,
    paddingRight: '20px',
};

const pricingValueColumn = {
    width: '40%',
    textAlign: 'right' as const,
};

const detailTotal = {
    fontSize: '20px',
    color: '#111111',
    fontWeight: '700',
    margin: '0',
};

const buttonSection = {
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#F5F3EF',
    color: '#111111',
    border: '1px solid #C6A14A',
    padding: '14px 28px',
    borderRadius: '4px',
    fontWeight: '500',
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    transition: 'all 0.2s ease',
};
