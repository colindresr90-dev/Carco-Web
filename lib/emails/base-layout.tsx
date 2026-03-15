import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
    Img,
    Font,
} from '@react-email/components';

interface BaseLayoutProps {
    previewText: string;
    children: React.ReactNode;
}

export const BaseLayout = ({ previewText, children }: BaseLayoutProps) => {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Playfair Display"
                    fallbackFontFamily="Georgia"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PweL.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Helvetica"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={logo}>CarCo</Text>
                    </Section>

                    <Section style={contentContainer}>
                        {children}
                    </Section>

                    <Section style={footer}>
                        <Text style={footerText}>
                            CarCo — Movilidad con carácter en El Salvador
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default BaseLayout;

const main = {
    backgroundColor: '#F5F3EF',
    fontFamily: 'Inter, -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '40px 0',
    maxWidth: '600px',
};

const header = {
    padding: '30px 20px',
    textAlign: 'center' as const,
};

const logo = {
    fontSize: '32px',
    fontWeight: '700',
    fontFamily: '"Playfair Display", Georgia, serif',
    letterSpacing: '-1px',
    margin: '0',
    color: '#111111',
};

const contentContainer = {
    padding: '0 20px 40px 20px',
};

const footer = {
    backgroundColor: '#111111',
    padding: '40px 20px',
    textAlign: 'center' as const,
    borderRadius: '8px',
};

const footerText = {
    color: '#FFFFFF',
    fontSize: '14px',
    margin: '0',
    opacity: 0.8,
};
