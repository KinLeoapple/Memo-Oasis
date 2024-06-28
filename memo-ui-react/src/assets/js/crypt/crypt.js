import bcrypt from 'bcryptjs';
import { md5 } from 'js-md5';

const max = 10;
const min = 0;
const cost = () => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const crypt_str = async (str) => {
    const md5Password = md5(str.toString()).toString();

    return new Promise(resolve => {
        // 前端加密
        bcrypt.genSalt(cost(), (err, salt) => {
            bcrypt.hash(md5Password, salt, (err, hash) => {
                resolve(hash);
            });
        });
    });
}