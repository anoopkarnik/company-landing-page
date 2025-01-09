import React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

const EmailVerification = ({ verificationLink }:{verificationLink:string}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans text-gray-800">
          <Container className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <Section className="bg-green-500 text-white text-center py-4">
              <Text className="text-xl font-bold">Verify Your Email</Text>
            </Section>

            {/* Content */}
            <Section className="p-6 text-center">
              <Text className="text-lg mb-4">Hello,</Text>
              <Text className="mb-4">
                Thank you for registering with us! Please click the button below
                to verify your email address:
              </Text>
              <a
                href={verificationLink}
                className="inline-block px-6 py-3 bg-green-500 text-white font-medium rounded-md shadow-md hover:bg-green-800 transition"
              >
                Verify Email
              </a>
              <Text className="mt-6">
                If the button above doesn't work, copy and paste the following
                link into your browser:
              </Text>
              <Text className="mt-2 text-green-500 underline break-all">
                <a href={verificationLink}>{verificationLink}</a>
              </Text>
              <Text className="mt-4 text-gray-600">
                If you did not create an account, no further action is required.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 text-center text-sm p-4">
              <Text className="text-gray-500">
                &copy; 2024 Bayesian Labs. All rights reserved.
              </Text>
              <Text className="text-gray-500 mt-2">
                If you have any questions, feel free to{' '}
                <a
                  href="mailto:support@bsamaritan.com"
                  className="text-green-500 underline"
                >
                  contact us
                </a>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailVerification;
