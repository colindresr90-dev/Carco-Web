import * as React from 'react';
import {
    Section,
    Text,
    Row,
    Column,
    Button,
} from '@react-email/components';
import { BaseLayout } from './base-layout';

interface ReservationCancelledProps {
    customerName: string;
    reservationNumber: string;
    vehicleName: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    refundAmount?: number;
    cancellationReason?: string;
}

export const ReservationCancelledEmail = ({
    customerName = "Cliente",
    reservationNumber = "CARCO-12345",
    vehicleName = "Vehículo Premium",
    pickupDate = "10 de Octubre, 2026",
    returnDate = "15 de Octubre, 2026",
    pickupLocation = "Aeropuerto Internacional de El Salvador (SAL)",
    refundAmount,
    cancellationReason,
}: ReservationCancelledProps) => {
    return (
        <BaseLayout previewText="Su reserva con CarCo ha sido cancelada">
            <Section style={contentSection}>
                <Text style={headline}>
                    Su Reserva Ha Sido Cancelada
                </Text>
                <Text style={subtext}>
                    La reserva asociada a su cuenta (<strong>{reservationNumber}</strong>) ha sido cancelada exitosamente. Si desea realizar una nueva reserva, estaremos encantados de asistirle.
                </Text>

                <Section style={detailsContainer}>
                    <Text style={detailsTitle}>Detalles de la Reserva Cancelada</Text>

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

                    {cancellationReason && (
                        <Row style={detailRow}>
                            <Column style={detailLabelColumn}>
                                <Text style={detailLabel}>Motivo</Text>
                            </Column>
                            <Column>
                                <Text style={detailValue}>{cancellationReason}</Text>
                            </Column>
                        </Row>
                    )}

                    <Row style={{ ...detailRow, borderBottom: 'none', paddingBottom: '0' }}>
                        <Column style={detailLabelColumn}>
                            <Text style={detailLabel}>Ubicación</Text>
                        </Column>
                        <Column>
                            <Text style={detailValue}>{pickupLocation}</Text>
                        </Column>
                    </Row>

                    {refundAmount !== undefined && refundAmount > 0 && (
                        <Row style={detailRow}>
                            <Column style={detailLabelColumn}>
                                <Text style={detailLabel}>Monto Reembolsado</Text>
                            </Column>
                            <Column>
                                <Text style={{ ...detailValue, color: '#C6A14A', fontWeight: 'bold' }}>
                                    ${Number(refundAmount).toFixed(2)} USD
                                </Text>
                            </Column>
                        </Row>
                    )}
                </Section>

                <Section style={buttonSection}>
                    <Button style={button} href="https://tudominio.com/">
                        Reservar Nuevamente
                    </Button>
                </Section>
            </Section>
        </BaseLayout>
    );
};

export default ReservationCancelledEmail;

const contentSection = {
    backgroundColor: '#F5F3EF',
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

const detailsContainer = {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '25px',
    marginBottom: '35px',
    border: '1px solid #EAEAEA',
};

const detailsTitle = {
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: '#888888',
    margin: '0 0 20px 0',
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
    width: '35%',
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

const buttonSection = {
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#C6A14A',
    color: '#FFFFFF',
    padding: '16px 32px',
    borderRadius: '4px',
    fontWeight: '500',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
};
