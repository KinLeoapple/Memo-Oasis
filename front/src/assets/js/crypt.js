import bcrypt from 'bcryptjs';
import {post_login} from "@/assets/js/api.js";
import md5 from 'crypto-js/md5.js'

const max = 10;
const min = 0;
const cost = () => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const crypt_login = async (username, password) => {
    const md5Password = md5(password.toString()).toString();

    return new Promise(resolve => {
        // 前端加密密码
        bcrypt.genSalt(cost(), (err, salt) => {
            bcrypt.hash(md5Password, salt, (err, hash) => {
                // 将用户名和加密后的密码发送到后端进行登录验证
                resolve(post_login(username.toString(), hash));
            });
        });
    });
}