import db from "../dataBase/connect.js";
import bcrypt from "bcryptjs";
import validator from "email-validator";

export const loginCheck = async (email, password) => {
    if (!email) {
        throw Error('برجاء إدخال البريد الإلكتروني');
    }
    if (!validator.validate(email)) {
        throw Error('البريد الإلكتروني غير صالح');
    }
    if (!password) {
        throw Error('برجاء إدخال كلمة المرور');
    }

    const [[ user ]] = await db.query(`SELECT * FROM employees WHERE email = ?`, email);

    if (!user) {
        throw Error('البريد الإلكتروني غير موجود في قاعدة البيانات');
    }

    const ok = await bcrypt.compare(password, user.password);
    if(ok) {
        return user;
    }
    else {
        throw Error('كلمة المرور غير صحيحه');
    }
};