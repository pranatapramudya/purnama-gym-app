import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: 'Purnama Gym',
  description: 'Purnama Gym Sumedang Khusus Wanita',
  appleWebApp: {
    capable: true,
    title: 'Purnama Gym',
    statusBarStyle: 'default',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#059669', // Emerald 600
          colorBackground: '#ffffff',
          colorDanger: '#ef4444',
          borderRadius: '0.75rem',
        },
        elements: {
          formButtonPrimary:
            "bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors",
          card: "shadow-xl border border-emerald-100/50",
          headerTitle: "text-emerald-900 font-bold",
          headerSubtitle: "text-slate-500",
          socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 transition-colors",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  )
}