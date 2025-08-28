// const jwt = require('jsonwebtoken');

// const generateToken = () => {
//   return jwt.sign(
//     {
//       username: 'Abiskare',
//     },
//     'HELLOIAMABISKARLAMICHHANE',
//     {
//       algorithm: 'HS512',
//       expiresIn: '1m',
//     }
//   );
// };

// const verifyToken = (token) => {
//   try {
//     jwt.verify(
//       token,
//       'HELLOIAMABISKARLAMICHHANE',
//       {
//         algorithm: 'HS512',
//       },
//       (error, data) => {
//         if (error) {
//           throw error;
//         }
//         console.log(data);
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// // const token = generateToken();
// // console.log(token);

// verifyToken(
//   'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFiaXNrYXJlIiwiaWF0IjoxNzUyNzQwODEyLCJleHAiOjE3NTI3NDA4NzJ9.GnaYIIH-4uDtdriHok0N0WahrVJ0Ox5hUimXDq0-S-7yNSV-8tfx0XzLVGXYF0lqYT3uum-5cTHu7LlxG5Ssng'
// );

(async () => {
  try {
    const { CompactEncrypt } = await import('jose');
    const Crypto = require('crypto');

    let { publicKey, privateKey } = new Crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'Thisissecret',
      },
    });
    // console.log(privateKey, publicKey);
    const jwe = new CompactEncrypt(new TextEncoder().encode('BDHABD'))
      .setProtectedHeader({
        alg: 'RSA-OAEP-256',
        enc: 'A256GCM',
      })
      .encrypt(publicKey);

    console.log(jwe);
  } catch (error) {
    console.log(error);
  }
})();
