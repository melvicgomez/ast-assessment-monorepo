import type { Metadata } from 'next';
import { AuthProvider } from './providers/UserContext';

import './globals.css';
import { MessageProvider } from './providers/ChatMessageContext';

export const metadata: Metadata = {
  title: 'AST - Assessment',
  description: 'This project is developed for the purpose of assessment.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MessageProvider>
          <AuthProvider>{children}</AuthProvider>
        </MessageProvider>
      </body>
    </html>
  );
}
