const mongoose = require("mongoose");

const db = 'mongodb+srv://singh823232:satyaM12321@cluster0.1zgq9.mongodb.net/register?retryWrites=true&w=majority';


mongoose.connect(db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.log(`no connection`);
}) 

                    //############ now goint yo generate otp ##############//
                    // const otp = otpGenerator.generate(6, {
                    //     upperCase: false,
                    //     digits: true,
                    //     specialChars: false,
                    //     alphabets: false
                    // });

                    // res.send("vallid");
                    // console.log(usermail);


                    //##################### using  nodemailer #################//
                    // const transporter = nodemailer.createTransport({
                    //     service: "gmail",
                    //     auth: {
                    //         user : "14as1913196@gmail.com",
                    //         pass : "satyaM12321"
                    //     }
                    // });
                    // const mailOption = {
                    //     from: "14as1913196@gmail.com",
                    //     to: usermail.email,
                    //     subject: "otp for verification",
                    //     text: otp
                    // };

                    // transporter.sendMail(mailOption, function (error, info){
                    //     if(error) {
                    //         res.send("error");
                    //     }
                    //     else {
                    //         res.send("email send");
                    //     }
                    // });
                    //################################ ending #################################//


//   mongodb+srv://singh823232:<password>@cluster0.1zgq9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority