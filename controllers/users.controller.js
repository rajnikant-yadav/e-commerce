const { createHttpError } = require('../errors/custom-error');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
    checkUser,
    registerSvc,
    getUserByEmail,
    checkPassword,
    getProfileSvc,
    editProfileSvc,
} = require('../services/users.services');

const register = async (req, res, next) => {
    const userDetails = { email: req.body.email, name: req.body.name, password: req.body.password };
    if (Object.keys(userDetails).length === 0) {
        const httpError = createHttpError('Body is Missing ', 400);
        next(httpError);
        return;
    }

    if (await checkUser(req.body.email)) {
        return res.status(400).send({ success: false, msg: 'User Already Registered' });
    }
    const insertedUser = await registerSvc(userDetails);
    const userToSend = { ...insertedUser.toObject() };
    delete userToSend.password;
    userToSend.success = true;
    res.status(201).json(userToSend);
};
const login = async (req, res, next) => {
    const credentials = req.body;
    if (!(credentials?.email && credentials?.password)) {
        const httpError = createHttpError('Bad request', 400);
        next(httpError);
        return;
    }
    const { email, password } = credentials;
    try {
        const user = await getUserByEmail(email);
        console.log();
        await checkPassword(user, password);
        const claims = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        jwt.sign(claims, process.env.JWT_SECRET, function (error, token) {
            // some problem in generating JWT
            if (error) {
                const httpError = createHttpError('Internal 56 Server Error', 500);
                next(httpError);
            }
            const userDetails = {
                name: user.name,
                email: user.email,
                token: token,
                role:user.role,     
                success: true,
            };
            res.status(201).json(userDetails);
        });
    } catch (error) {
        if (error.type === 'BadCredentials') {
            // Email, password is provided but is incorrect -> 403
            const httpError = createHttpError(error.message, 403);
            next(httpError);
        } else {
            const httpError = createHttpError('Internal Server Error', 500);
            next(httpError);
        }
    }
};
const getProfile = async (req, res) => {
    const userId = res.locals.claims.id;
    try {
        const userDetails = await getProfileSvc(userId);

        let userToSend = { ...userDetails.toObject() };
        delete userToSend.password;

        userToSend.success = true;
        res.status(201).json(userToSend);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};
const editProfile = async (req, res) => {
    const data = req.body;
    const userId = res.locals.claims.id;
    try {
        const userDetails = await editProfileSvc(userId, data);

        let userToSend = { ...userDetails.toObject() };
        delete userToSend.password;
        userToSend.success = true;
        res.status(201).json(userToSend);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    editProfile,
};
