const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const addressSchema = require('./Address');

const user = {
    email: {
        type: String,
        required: [true, 'Email must be Provided'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name must be Provided'],
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    },
    phone: {
        type: String,
        default: '',
    },
    profilePic: {
        type: String,
        default: '../assets/images/dummy-profile.jpg',
    },
    birthday: {
        type: Date,
        default: '',
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    address: {
        type: addressSchema,
    },
};

const userSchema = new mongoose.Schema(user);

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

userSchema
    .path('email')
    .validate((email) => emailPattern.test(email), 'Invalid email. Please make sure the email is right format');

userSchema
    .path('password')
    .validate(
        (password) => passwordPattern.test(password),
        'Password must have at least upper case, 1 lower case, 1 digit , 1 specail characters, and should be 8 character in length.'
    );

const SALT_FACTOR = 10;
userSchema.pre('save', function (done) {
    const user = this; // const user -> new User()
    if (!user.isModified('password')) {
        done();
        return;
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return done(err); // Mongoose will not insert the user document
        }
        bcrypt.hash(user.password, salt, function (err, hashedPassword) {
            if (err) {
                return done(err);
            }
            user.password = hashedPassword;
            done(); // pass no arguments to done() to signify success
        });
    });

    console.log('executes immediately');
});

userSchema.methods.checkPassword = async function (plainTextPassword) {
    const hashedPassword = this.password;

    // this line will throw an error sometimes
    // if on the other hand bcrypt is able to compare it will return true / false
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    return isMatch;
};

module.exports = mongoose.model('User', userSchema);
