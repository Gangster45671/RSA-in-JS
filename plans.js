var message = "Clara Oswald";
var secretKey = new RSAKey(true);
secretKey.setType("public");
message = RSA.encryptWithKey(message, secretKey);
console.log(message);
secretKey.setType("private");
console.log(RSA.decryptWithKey(message, secretKey));


move key generation to RSA class
make RSA.generateKeyPair() and
return key objects

make Key class independent public || private

maybe bundle key class ? RSA.Key ?€