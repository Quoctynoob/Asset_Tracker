export const metadata = {
  title: 'Stock Portfolio',
  description: 'All about stock',
  icons: {
    icon: '/favicon/ketchup.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
