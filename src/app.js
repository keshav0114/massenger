require('dotenv').config();
const { response } = require("express");
const express = require("express");
const bcrypt = require("bcryptjs");
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");

// const path = require("path")   // why---dir path ke liye


const app = express();

require("./db/conn.js");
const Register = require("./models/registers");
const { Mongoose } = require("mongoose");

const port = process.env.PORT || 3000;

// const static_path = path.join(__dirname, "../public")
// const view_path = path.join(__dirname, "../views")
// console.log(path.join(__dirname, "../views"));


app.use(cookieParser());
app.use(express.json());      // for json format
app.use(express.urlencoded({
    extended: false
}));

// app.use(express.static(static_path));
// app.set("view engine", "hbs");

// app.get("/", (req, res) => {
//     res.render("register")
// });


app.post("/register", async (req, res) => {
    try {
        const employeeSchema = new Register(req.body)   //new register ko dalne ke liye
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {                   // if laga hai password and confirm password ke liye

            const token = await employeeSchema.generateAuthToken();  // for generating token
            console.log(token);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true   // cookie se jhedjhad nahi kar payega user
            });
            console.log(cookie);

            const registered = await employeeSchema.save()   // save use hua hai save karne ke liye data in database and ye promise return karega jo ki resolve hota hai to then nahi to catch me jayega
            res.status(200).send(registered);
            // console.log(registered)

        } else {
            res.status(400).send("password not maching");
        }


    }
    catch (error) {
        res.status(400).send(error);
    }
})

// {
//     "firstname" : "dinkar",
//     "lastname" : "sattu",
//     "email" : "14as1913196@gmail.com",
//     "phone" : "9999999499",
//     "age" : "22",
//     "password" : "sattu",
//     "confirmpassword" : "sattu"
// }


// ################################################################################################################################# //
// ################################################################################################################################# //
// ####################################  LOG IN HAI YAHAN ########################################################################## //
// ################################################################################################################################# //
// ################################################################################################################################# //


app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const usermail = await Register.findOne({ email: email });
        console.log(usermail);
        if (usermail) {
            const isMatch = await bcrypt.compare(password, usermail.password);  // ye compare karega user ke password ko database ke password se
            // console.log(isMatch)
            const token = await usermail.generateAuthToken();
            console.log(token);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true,   // cookie se jhedjhad nahi kar payega user
                secure: true
            });
            console.log(cookie);
            console.log(`ye hai hamara cookie ${req.cookies.jwt}`);



            if (isMatch) {
                res.status(201).send(usermail.password);
            } else {
                res.send("invalid password");
            }
        }

    } catch (error) {
        res.status(400).send(error);
    }
})



// ################################################################################################################################# //
// ################################################################################################################################# //
// ####################################  going to use token authentication ######################################################### //
// ################################################################################################################################# //
// ################################################################################################################################# //

// const jwt = require("jsonwebtoken");

// const createToken = async () => {
//     const token = await jwt.sign({ _id: "60fc220e612d3e2c287b95f8" }, "helwojkdfhisilirnllmsdoigjhnooeic", {
//         // expiresIn : "5 minutes"
//     });
//     // console.log(token);

//     const userVar = await jwt.verify(token, "helwojkdfhisilirnllmsdoigjhnooeic");
//     // console.log(userVar);
// }

// createToken();



// ################################################################################################################################# //
// ################################################################################################################################# //
// ####################################  otp wala part yahan se karunga ############################################################ //
// ################################################################################################################################# //
// ################################################################################################################################# //

app.post("/resetpass", async (req, res) => {

    try {

        const email = req.body.email;
        const usermail = await Register.findOne({ email: email });
        // console.log(usermail);
        if (usermail) {
            // res.send(usermail);

            // const otp = Math.random();
            // otp = otp * 1000000;
            // otp = parseInt(otp);

            // const otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
            // console.log(otp);
            // res.send("otp");

            // res.status(200).send(otp);
            // res.send(otp);

            const otp = otpGenerator.generate(6, {
                upperCase: false,
                digits: true,
                specialChars: false,
                alphabets: false
            });
            // res.send(otp);
            // usermail.reset = otp;
            // usermail.expireOtp = Date.now() + 3600000;
            // usermail.save()
            // .then(() =>{
            //     console.log("success");
            // })
            // .catch((e) => {
            //     console.log(e);
            // })

            // Mongoose.set('useFindAndModify', false);
            const doc = await Register.findOneAndUpdate({
                email: email,
                reset: otp,
                updatedAt: new Date
            });
            // npm install mongoose moment mongoose-moment


            console.log(otp);
            //##################### using  nodemailer #################//
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "satyam1913196@akgec.ac.in",
                    pass: "satyaM12321"
                }
            });
            const mailOption = {
                from: "satyam1913196@akgec.ac.in",
                to: usermail.email,
                subject: "Validation OTP for reset your password",    // https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbGZVWUJFbnFPUFk1aGVkMm9UVHhnaWJjc1FYUXxBQ3Jtc0tuZnFNa3BMVkR5SkZIWm5lLWw0NEF5b0tsYnF3T2dnR3pXUm1xNVo4YTJ2cFJiLVJsdGpfc24zYkpaWGx5bnFiT3lLb0NGQk9zcVlqaF9lRXI3alN6Qm5XVXBHNEdNS2NkeERuY0tZaDg5ZW1aUkZEYw&q=https%3A%2F%2Fmyaccount.google.com%2Flesssecureapps
                html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
            };



            transporter.sendMail(mailOption, function (error, info) {
                if (error) {
                    res.send(error);
                }
                else {
                    res.send(mailOption);
                }
            });



            // app.post("/otp", (req, res) => {
            //     const num = req.body.otp;
            //     if (otp === num) {
            //         [

            //         ]
            //     }
            // })

            // const doc = await Register.findOneAndUpdate({
            //     email : email,
            //     reset : null
            // });




            //################################ ending #################################//


        } else {
            res.status(400).send("error hai");
        }

    } catch (error) {
        res.send("failed to fetch the data");
    }

})


// app.post("/otpEmail", async (req, res) => {
//     const otpUser = req.body.otpfield;
//     const otpDatabase = 
// })



app.listen(port, () => {
    console.log(`server is running on port no ${port}`);
})