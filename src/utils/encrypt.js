const CryptoJS = require("crypto-js"); //npm有手就行

const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF"); //密钥
const iv = CryptoJS.enc.Utf8.parse("ABCDEF1234123412"); //密钥偏移量


//加密   前端写在本地里  既然密钥存起来了是不是得再写个云函数获取密钥呢！！！
function Encrypt(word) {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString().toUpperCase();
}



export default Encrypt;

