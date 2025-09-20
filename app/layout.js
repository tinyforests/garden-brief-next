import './globals.css'

export const metadata = {
  title: 'Garden Design Questionnaire — Gardener & Son',
  description: 'A calm, 10-minute questionnaire to get to know your new garden.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
