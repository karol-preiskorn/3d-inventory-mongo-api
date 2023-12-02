import nodemailer from "nodemailer"
import { Request, Response } from "express"
import { check, validationResult } from "express-validator"

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
})

/**
 * Contact form page.
 * @route GET /contact
 */
export const getContact = (req: Request, res: Response) => {
  res.render("contact", {
    title: "Contact"
  })
}

/**
 * Send a contact form via Nodemailer.
 * @route POST /contact
 */
export const postContact = async (req: Request, res: Response) => {
  await check("name", "Name cannot be blank").not().isEmpty().run(req)
  await check("email", "Email is not valid").isEmail().run(req)
  await check("message", "Message cannot be blank").not().isEmpty().run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.redirect("/contact")
  }

  const mailOptions = {
    to: "your@email.com",
    from: `${req.body.name} <${req.body.email}>`,
    subject: "Contact Form",
    text: req.body.message
  }

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash("errors", { msg: err.message })
      return res.redirect("/contact")
    }
    res.redirect("/contact")
  })
}
