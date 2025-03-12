// import request = require("supertest");
// import { randomEmail, randomOwner, randomString } from "../utils/random";
// import { createServer } from "../utils/createServer";

// const app = createServer();

// const password = randomString(8);
// const userInput = {
//   email: randomEmail(),
//   username: randomOwner(),
//   first_name: randomString(6),
//   last_name: randomString(6),
//   hashed_password: password,
//   confirm_password: password,
// };

// describe("/api/users", () => {
//   describe("[POST] /api/users", () => {
//     it("should respond with a `201` status code and user details", async () => {
//       const { status } = await request(app)
//         .post("/api/users")
//         .send({
//           ...userInput,
//         });
//       // expect(body).toHaveProperty("email");
//       expect(status).toBe(200);
//     });
//   });
// });
