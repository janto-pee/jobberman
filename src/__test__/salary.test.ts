import request from "supertest";
import { createServer } from "../utils/createServer";
import { connectionScript, prisma } from "../scripts";
import { salaryInput, userInput } from "../utils/types";

const app = createServer();

let accessResponse: string;
let salaryResponse: any;
let sessionResponse: any;

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
      sessionResponse = userInput;
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
      expect(body.accessToken).toBeDefined;
      accessResponse = body.accessToken;
    });
  });

  describe("/api/salary", () => {
    describe("[POST] /api/salary", () => {
      it("should respond with a `201` status code", async () => {
        const { status, body } = await request(app)
          .post("/api/salary")
          .send({
            ...salaryInput,
          })
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        salaryResponse = body.data;
      });
    });

    describe("[GET] /api/salary", () => {
      it("should respond with a `201` status code for all companies", async () => {
        const { status, body } = await request(app).get("/api/salary");
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("salary");
      });
    });

    describe("[GET] /api/salary/:id", () => {
      it("should respond with a `200` status code and company details", async () => {
        const { status, body } = await request(app).get(
          `/api/salary/${salaryResponse.id}`
        );
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("salary");
      });
    });

    describe("[GET] /api/salary/filter/keyword", () => {
      it("should respond with a `200` status code and company filter", async () => {
        const { status, body } = await request(app).get(
          `/api/salary/filter/keyword?maximumMinor=${salaryResponse.maximumMinor}`
        );
        expect(status).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("page");
        expect(body).toHaveProperty("salary");
      });
    });

    describe("[GET] /api/salary/search/keyword", () => {
      it("should respond with a `404` status code and a list of matching companies", async () => {
        const { status, body } = await request(app).get(
          `/api/salary/search/keyword?search=${salaryResponse.currency}`
        );
        console.log(status, body);
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("page");
        expect(body).toHaveProperty("salary");
      });
    });

    describe("[PUT] /api/salary/:id", () => {
      it("should update with a `201` status code for updated company", async () => {
        const { status, body } = await request(app)
          .put(`"/api/salary/${salaryResponse.id}`)
          .set("Authorization", `Bearer ${accessResponse}`)
          .send({
            name: "companyname",
            website: "website",
            size: "30",
          });
        expect(status).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
      });
    });
    describe("[DELETE] /api/", () => {
      it("should respond with a `200` status code for deleted company", async () => {
        const { status, body } = await request(app)
          .delete(`/api/salary/${salaryResponse.id}`)
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
      });
    });
  });
});
