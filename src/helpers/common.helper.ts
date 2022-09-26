import { SHA256, HmacSHA256, enc } from 'crypto-js';

export class CommonHelper {
    public static uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    public static generateCode(prefixLength = 3) {
        const characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        let prefix = '';
        for (let i = 0; i < prefixLength; i++) {
            prefix += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return `${prefix}${this.uuidv4().substring(0, 5)}`;
    }
    public static isEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }
    public static sha256(message: string) {
        return SHA256(message).toString();
    }
    public static hmacSha256(message: string | CryptoJS.lib.WordArray, key: string | CryptoJS.lib.WordArray): CryptoJS.lib.WordArray {
        return HmacSHA256(message, key);
    }
    public static base64WordArray(data: CryptoJS.lib.WordArray) {
        return enc.Base64.stringify(data);
    }
}