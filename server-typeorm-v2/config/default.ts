// export default {
//   port: 1337,
//   logLevel: "info",
//   saltWorkFactor: 8,
//   accessTokenPrivate: ``,
//   refreshTokenPrivate: ``,
//   accessTokenPublic: ``,
//   refreshTokenPublic: ``,
//   smtp: {
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     user: "",
//     pass: "",
//   },
// };

export default {
  port: process.env.PORT,
  logLevel: "info",
  saltWorkFactor: Number(process.env.SALTWORKFACTOR),
  accessTokenPrivate: process.env.accessTokenPrivate,
  refreshTokenPrivate: process.env.refreshokenPrivate,
  accessTokenPublic: process.env.accessTokenPublic,
  refreshTokenPublic: process.env.refreshTokenPublic,
  smtp: {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    user: "",
    pass: "",
  },
};
