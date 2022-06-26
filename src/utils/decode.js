const CryptoJS = require("crypto-js"); //npm有手就行

const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF"); //密钥
const iv = CryptoJS.enc.Utf8.parse("ABCDEF1234123412"); //密钥偏移量
//解密  写在云函数里   既然密钥存起来了是不是得再写个云函数获取密钥呢！！！
function Decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }

  export default Decrypt;