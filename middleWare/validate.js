import db from "../dataBase/connect.js";
import bcrypt from "bcrypt";
import validator from "email-validator";

export const loginCheck = async (email, password) => {
    if (!email) {
        throw Error('enter an email');
    }
    if (!validator.validate(email)) {
        throw Error('enter a valid email');
    }
    if (!password) {
        throw Error('enter a password');
    }

    const [[ user ]] = await db.query(`SELECT * FROM employees WHERE email = ?`, email);

    if (!user) {
        throw Error('email is not found');
    }

    // // to use after hashing passwords
    // try {
    //     const auth = await bcrypt.compare(password, user.password);
    //     return user;
    // }
    // catch (err) {
    //     throw Error('incorrect password');
    // }

    if (user.password == password) {
        return user;
    }
    else {
        throw Error('incorrect password');
    }
};