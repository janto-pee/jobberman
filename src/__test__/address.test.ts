import request from "supertest";
import { createServer } from "../utils/createServer";
import { connectionScript, prisma } from "../scripts";
import { addressInput, userInput } from "../utils/types";

const app = createServer();

// let sessionResponse: {
//   email: string;
//   username: string;
//   first_name: string;
//   last_name: string;
//   hashed_password: string;
//   confirm_password: string;
//   street: string;
//   country: string;
// };
let accessResponse: string;

let addressResponse: {
  id: string;
  street: string;
  street2: string;
  city: string;
  state_province_code: string;
  state_province_name: string;
  postal_code: string;
  country_code: string;
  latitude: string;
  longitude: string;
  country: string;
};

describe("session", () => {
  beforeAll(async () => {
    connectionScript(true);
  });

  afterAll(async () => {
    connectionScript(false);
    await prisma.$disconnect();
  });

  describe("[POST] /api/users", () => {
    it("should respond with a `201` status code for creating users", async () => {
      const { status, body } = await request(app)
        .post("/api/users")
        .send({
          ...userInput,
        });
      expect(status).toBe(201);
      expect(body.status).toBe(true);
      expect(body.message).toBeTruthy();
      expect(body.data.id).toBeTruthy();
      expect(body.data.first_name).toBe(userInput.first_name);
      expect(body.data.last_name).toBe(userInput.last_name);
      expect(body.data.is_email_verified).toBe(false);
      expect(body.data.address.id).toBeTruthy();
      expect(body.data.address.street).toBe(userInput.street);
      expect(body.data.address.country).toBe(userInput.country);
      // sessionResponse = userInput;
    });
  });

  describe("[POST] /api/auth", () => {
    it("should respond with a `201` status code for creating sesion", async () => {
      const { status, body } = await request(app).post("/api/auth").send({
        email: userInput.email,
        hashed_password: userInput.hashed_password,
        user_agent: "xuz",
        client_ip: "bc",
      });
      expect(status).toBe(201);
      expect(body.session.is_blocked).toBe(false);
      expect(body.session.valid).toBe(true);
      expect(body.session.createdAt).toBeTruthy();
      expect(body.accessToken).toBeDefined();
      accessResponse = body.accessToken;
    });
  });

  describe("/api/address", () => {
    describe("[POST] /api/address", () => {
      it("should respond with a `201` status code", async () => {
        const { status, body } = await request(app)
          .post("/api/address")
          .send({
            ...addressInput,
          })
          .set("Authorization", `Bearer ${accessResponse}`);

        expect(status).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        addressResponse = body.data;
      });
    });

    describe("[GET] /api/address", () => {
      it("should respond with a `200` status code for all companies", async () => {
        const { status, body } = await request(app).get("/api/address");
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("total");
        expect(body).toHaveProperty("page");
        // expect(body).toHaveProperty("address");
      });
    });

    describe("[GET] /api/address/:id", () => {
      it("should respond with a `200` status code and address details", async () => {
        const { status, body } = await request(app).get(
          `/api/address/${addressResponse.id}`,
        );

        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("address");
      });
    });

    describe("[PUT] /api/address/:id", () => {
      it("should update with a `200` status code for updated address", async () => {
        const { status, body } = await request(app)
          .put(`/api/address/${addressResponse.id}`)
          .send({
            ...addressInput,
          })
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
      });
    });
  });
});
