require('dotenv').config();
const { response, json } = require("express");
const express = require("express");
const bcrypt = require("bcryptjs");
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const cors = require("cors")

// const path = require("path")   // why---dir path ke liye


const app = express();

require("./src/db/conn.js");
const Register = require("./src/models/registers");
const { Mongoose } = require("mongoose");

const port = process.env.PORT || 8000;

// ######################################### for extract minute sec and day from date ##############################################

// const date1 = new Date("2021-08-11T17:28:03.880+00:00");
// const date2 = new Date("2021-08-11T17:23:29.793+00:00");
// const diffDays = parseInt((date1 - date2) / (1000 * 60)); //gives day difference
// //one_day means 1000*60*60*24
// //one_hour means 1000*60*60
// //one_minute means 1000*60
// //one_second means 1000
// console.log(diffDays)



// ###################################################################################################################################

// const static_path = path.join(__dirname, "../public")
// const view_path = path.join(__dirname, "../views")
// console.log(path.join(__dirname, "../views"));


app.use(cookieParser());
app.use(express.json());      // for json format
app.use(express.urlencoded({
    extended: false
}));

app
app.use((req, res, next) => {  // To remove CROS (cross-resource-origin-platform) problem
    res.setHeader('Access-Control-Allow-Origin', "*"); // to allow all client we use *
    res.setHeader('Access-Control-Allow-Methods', "OPTIONS,GET,POST,PUT,PATCH,DELETE"); //these are the allowed methods
    res.setHeader('Access-Control-Allow-Headers', "*"); // allowed headers (Auth for extra data related to authoriaztiom)
    next();
})

// app.use(express.static(static_path));
// app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.send("working");
});


app.post("/register", async (req, res) => {
    try {
        const employeeSchema = new Register(req.body)   //new register ko dalne ke liye
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {                   // if laga hai password and confirm password ke liye

            const token = await employeeSchema.generateAuthToken();  // for generating token
            console.log(token);
            // <<<<<<< HEAD
            //             // res.cookie("jwt", token, {
            //             //     expires: new Date(Date.now() + 30000),
            //             //     httpOnly: true   // cookie se jhedjhad nahi kar payega user
            //             // });
            //             // console.log(cookie);
            // =======
            // //             res.cookie("jwt", token, {
            // //                 expires: new Date(Date.now() + 30000),
            // //                 httpOnly: true   // cookie se jhedjhad nahi kar payega user
            // //             });
            // //             console.log(cookie);
            // >>>>>>> dd72d3f672dd4b0b0dc451f0a1db7f648af2f19c

            const registered = await employeeSchema.save()   // save use hua hai save karne ke liye data in database and ye promise return karega jo ki resolve hota hai to then nahi to catch me jayega
            res.status(200).send(registered.firstname);
            // console.log(registered)

        } else {
            res.status(201).send("password not maching");
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
        // console.log(usermail);
        console.log("ok");
        const isMatch = await bcrypt.compare(password, usermail.password);  // ye compare karega user ke password ko database ke password se
        console.log(isMatch)
        const token = await usermail.generateAuthToken();
        console.log(token);
        // res.cookie("jwt", token, {
        //     expires: new Date(Date.now() + 600000),
        //     httpOnly: true,   // cookie se jhedjhad nahi kar payega user
        //     secure: true
        // });
        // console.log(cookie);
        // console.log(`ye hai hamara cookie ${req.cookies.jwt}`)
        if (isMatch) {
            res.status(201).send(usermail.password);
        } else {
            res.send("invalid password");
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

app.post("/resetpass", async (req, res) => {                          //   d.getMinutes();  let date_ob = new Date();

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


            // console.log(doc.reset);
            //##################### using  nodemailer #################//
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS_E
                }
            });
            const mailOption = {
                from: process.env.EMAIL,
                to: usermail.email,
                subject: "Validation OTP for reset your password",    // https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbGZVWUJFbnFPUFk1aGVkMm9UVHhnaWJjc1FYUXxBQ3Jtc0tuZnFNa3BMVkR5SkZIWm5lLWw0NEF5b0tsYnF3T2dnR3pXUm1xNVo4YTJ2cFJiLVJsdGpfc24zYkpaWGx5bnFiT3lLb0NGQk9zcVlqaF9lRXI3alN6Qm5XVXBHNEdNS2NkeERuY0tZaDg5ZW1aUkZEYw&q=https%3A%2F%2Fmyaccount.google.com%2Flesssecureapps
                html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
            };



            transporter.sendMail(mailOption, function (error, info) {
                if (!error) {
                    res.send("OTP sended");
                    // console.log()
                    // 2021-08-11T17:51:22.201+00:00
                }
                else {
                    res.send(error);
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
        console.log(error);
        res.send("failed to fetch the data");
    }

})


app.post("/otpverify", async (req, res) => {

    try {
        const otp = req.body.otp;
        // const email = req.body.email;
        const data = await Register.findOne({ reset: otp });
        if (data) {
            const date1 = data.updatedAt;
            const date2 = new Date;
            const diffMinute = parseInt((date2 - date1) / (1000 * 60));
            // res.send(`${diffMinute}`);
            if (diffMinute <= 5) {
                res.status(202).send("Verification Succesfull");
                console.log(data);
            }
            else {
                res.send("time out")
            }
        }
        else {
            res.send("incorrect otp")
        }
    } catch (error) {
        console.log(error)
        res.send("incorrect otp");
    }

})





app.listen(port, () => {
    console.log(`server is running on port no ${port}`);
})


// 22: 16: 19
// 22: 18: 20


// var date1 = new Date("08/09/2017");
// var date2 = new Date("08/10/2017");
// var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); //gives day difference 
// //one_day means 1000*60*60*24
// //one_hour means 1000*60*60
// //one_minute means 1000*60
// //one_second means 1000
// console.log(diffDays)


// comapare dates in js

// var date1 = new Date('December 25, 2017 01:30:00');
// var date2 = new Date('June 18, 2016 02:30:00');

// //best to use .getTime() to compare dates
// if(date1.getTime() === date2.getTime()){
//     //same date
// }

// if(date1.getTime() > date2.getTime()){
//     //date 1 is newer
// }

// moment use

// console.log(moment.utc(moment(firstDate,"DD/MM/YYYY HH:mm:ss").diff(moment(secondDate,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"))
