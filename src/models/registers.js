const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const employeSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid Email")
            }
        }
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String
    },
    reset: {
        type: String,
        default: null
        // expireIn: Number
    },
    updatedAt: {
        type: Date,
        default: ""
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// employeSchema.index({"expireOtp" : 1,}, {expirAfterSeconds: 3});

// const otpSchema = new  mongoose.Schema({
//     reset: {
//         type : String,
//         default: ""
//     },
//     expireOtp: {
//         type: Date,
//         default: Date.now()
//     }
// })


employeSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        // console.log(token);
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

employeSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // const passwordHash = await bcrypt.hash(password, 10)
        // console.log(this.password);
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(this.password);
        this.confirmpassword = undefined;  // database pe confirmpassword show nahi hoga


    }
    next();
})




// now we neeed to create a collection

const Register = new mongoose.model("Register", employeSchema);

// const employeeSchema = new Register({

//     firstname : "satyam",
//     lastname : "singh", 
//     email : "gfdgfdgfd@gmail.com",
//     gender : "male",
//     phone : 8932823232,
//     age : 29,
//     password : "sattu",
//     confirmpassword : "sattu"

// })

// employeeSchema.save(); 
module.exports = Register;