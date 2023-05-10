require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB database connection established successfully");
  })
  .catch((err) => {
    console.log("Error connecting to the database: ", err);
  });

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Email = mongoose.model("Email", emailSchema);

router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    const existingEmail = await Email.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ status: 400, message: "Email already subscribed" });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: process.env.EMAIL,
      subject: "Welcome to our Recipe Newsletter!",
      html: `<h1>Hi there!</h1><h4>Thank you for subscribing to our recipe newsletter! We are thrilled to have you on board and can't wait to share some of our favorite recipes with you.</h4><h4>We will be sending you a special recipe every month, so be sure to keep an eye out for our emails. <br/>If you have any questions or feedback, please don't hesitate to reach out to us at antirmenel@gmail.com.</h4><h3>Happy cooking!</h3>`,
    };

    const emailDoc = new Email({ email });
    await emailDoc.save();
    console.log("Email saved to database");

    await sgMail.send(msg);

    res.status(201).json({ status: 201 });
  } catch (error) {
    console.log("Error: " + error);
    res.status(401).json({ status: 401, error });
  }
});

module.exports = router;
