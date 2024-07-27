import {md5} from 'js-md5';
import {JSEncrypt} from 'jsencrypt';
import {get_key} from "@/assets/js/api/api.js";

export const crypt_str = async (str) => {
    const md5Password = md5(str.toString()).toString();

    return new Promise(resolve => {
        const encrypt = new JSEncrypt();
        get_key().then(r => {
            if (r !== null) {
                const publicKeyBase64 = r.key;
                if (publicKeyBase64 !== null) {
                    encrypt.setPublicKey(publicKeyBase64)
                    resolve(encrypt.encrypt(md5Password));
                }
            }
        });
    });
}