import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

export async function POST(request) {
	try {
		const {
			firstName,
			lastName,
			phoneNumber,
			location,
			category,
			items,
			isProviding,
			isAnonymous
		} = await request.json()

		// Create a transporter using Gmail
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		})

		// Define email options
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: 'ryan@notqwerty.com',
			subject: 'New Aid Post Submission',
			html: `
        <h1>New Aid Post Submission</h1>
        <p>A new post has been submitted for approval:</p>
        <ul>
          <li><strong>Name:</strong> ${
						isAnonymous ? 'Anonymous' : `${firstName} ${lastName}`
					}</li>
          <li><strong>Phone Number:</strong> ${phoneNumber}</li>
          <li><strong>Location:</strong> ${location}</li>
          <li><strong>Category:</strong> ${category}</li>
          <li><strong>Items:</strong> ${JSON.stringify(items)}</li>
          <li><strong>Type:</strong> ${
						isProviding ? 'Providing Aid' : 'Requesting Aid'
					}</li>
        </ul>
        <p>Please review and approve this post in the admin dashboard.</p>
      `
		}

		// Send mail
		const info = await transporter.sendMail(mailOptions)
		console.log('Email sent: ' + info.response)

		return NextResponse.json({ message: 'Email sent successfully' })
	} catch (error) {
		console.error('Error sending email:', error)
		return NextResponse.json(
			{ error: 'Error sending email', details: error.message },
			{ status: 500 }
		)
	}
}
