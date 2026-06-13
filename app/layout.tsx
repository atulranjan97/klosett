import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/assets/styles/globals.css';
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: `%s | Klosett`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};
// `%s` gonna represent whatever that page title is but then we wanna add onto it with `| Klosett`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            toastOptions={{
              classNames: {
                error: '!bg-red-600 !text-white !border-red-700 !font-semibold',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

// Sonner kaam kaise karta hai?
// toast() ek global function hai — yeh kisi bhi component se call ho sakta hai. Lekin toast screen pe render kahan hoga? Uske liye ek single <Toaster /> component chahiye jo poori app mein ek jagah mounted ho.
// Agar <Toaster /> layout mein nahi hoga toh toast() call hoga lekin kuch dikhega nahi — kyunki render karne wala element hi nahi hai DOM mein.