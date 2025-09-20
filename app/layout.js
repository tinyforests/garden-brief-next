import './globals.css'
import { Abril_Fatface, Inter } from 'next/font/google'

// Heading font: Abril Fatface
const heading = Abril_Fatface({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-heading',
})

// Body font: swap Inter for your brand body font anytime
// (e.g., replace with another Google font or a local font)
const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata = {
  title: 'Garden Design Questionnaire — Gardener & Son',
  description:
    'A calm, 10-minute questionnaire to translate your hopes into a living, breathing garden.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  )
}
