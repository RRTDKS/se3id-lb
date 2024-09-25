'use client'
import localFont from 'next/font/local'
import { Roboto } from 'next/font/google'
import './globals.css'
import { IntlProvider } from 'react-intl'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto'
})

// export const metadata = {
// 	title: 'Se3id LB',
// 	description: 'Lebanon Aid Website - Connect, Support, Empower, made by QWERTY'
// }

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} font-sans antialiased`}>
				<IntlProvider>{children}</IntlProvider>
			</body>
		</html>
	)
}
