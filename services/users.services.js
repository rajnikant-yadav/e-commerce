const { createHttpError } = require('../errors/custom-error');
const User = require('../models/User');

// to check wheather is Already exist
const checkUser = async (payload) => {
    try {
        const user = await User.findOne({ email: payload });
        if (user) return true;
        return false;
    } catch (error) {
        if (error.name === 'ValidationError') {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = 'ValidationError';
            throw dbError;
        }
        if (error.name === 'CastError') {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        throw error;
    }
};

const registerSvc = async (payload) => {
    let insertedUser;
    try {
        insertedUser = await User.create(payload);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = 'ValidationError';
            throw dbError;
        }

        if (error.name === 'CastError') {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
    }
    if (!insertedUser) {
        const error = createHttpError('Bad Creadetials', 400);
        throw error;
    }
    return insertedUser;
};
const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user === null) {
        const error = createHttpError('User Not Found with the email', 404);
        error.type = 'BadCredentials';
        throw error;
    }
    return user;
};
const checkPassword = async (user, plainTextPassword) => {
    let isMatch;
    try {
        isMatch = await user.checkPassword(plainTextPassword);
    } catch (error) {
        const err = createHttpError('Something went wrong checking credentials');
        error.type = 'DBError';
        throw err;
    }
    if (!isMatch) {
        const error = new Error('Bad Credentials');
        error.type = 'BadCredentials';
        throw error;
    }
    return isMatch;
};
const getProfileSvc = async (id) => {
    let userDetails;
    try {
        userDetails = await User.findById(id);
    } catch (error) {
        throw error;
    }
    if (userDetails === null) {
        const error = createHttpError(`No user found with id: ${id}`, 400);
        throw error;
    }
    return userDetails;
};
const editProfileSvc = async (id, data) => {
    let userDetails;
    try {
        userDetails = await User.findByIdAndUpdate({ _id: id }, data, {
            new: true,
            runValidators: true,
        });
    } catch (error) {
        throw error;
    }
    if (!userDetails) {
        const error = createHttpError(`No user found with id: ${id}`, 400);
        throw error;
    }
    return userDetails;
};

module.exports = {
    checkUser,
    registerSvc,
    getUserByEmail,
    checkPassword,
    getProfileSvc,
    editProfileSvc,
};
