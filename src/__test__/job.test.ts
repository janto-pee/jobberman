import request from "supertest";
import { createServer } from "../utils/createServer";
import { connectionScript, prisma } from "../scripts";
import {
  companyInput,
  jobInput,
  metadataInput,
  userInput,
} from "../utils/types";

const app = createServer();

let sessionResponse: {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  hashed_password: string;
  confirm_password: string;
  street: string;
  country: string;
};
let accessResponse: string;
let jobResponse: any;
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

  describe("/api/jobs", () => {
    describe("[POST] /api/jobs", () => {
      it("should respond with a `201` status code", async () => {
        const { status, body } = await request(app)
          .post("/api/jobs")
          .send({
            ...jobInput,
          })
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("job");
        jobResponse = body.job;
      });
    });

    describe("[GET] /api/jobs", () => {
      it("should respond with a `201` status code for all jobs", async () => {
        const { status, body } = await request(app).get("/api/jobs");
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("job");
      });
    });

    describe("[GET] /api/jobs/:id", () => {
      it("should respond with a `200` status code and company details", async () => {
        const { status, body } = await request(app).get(
          `/api/jobs/${jobResponse.id}`
        );
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("job");
      });
    });

    describe("[GET] /api/jobs/filter", () => {
      it("should respond with a `200` status code and company filter", async () => {
        const { status, body } = await request(app).get(
          `/api/search/company/filter?city=${jobResponse.city}`
        );
        expect(status).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("page");
        expect(body).toHaveProperty("job");
      });
    });

    describe("[GET] /api/jobs/location/:location", () => {
      it("should respond with a `404` status code and a list of matching companies", async () => {
        const { status, body } = await request(app).get(
          `/api/jobs/location/${companyInput.street}`
        );
        console.log(status, body);
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("page");
        expect(body).toHaveProperty("company");
      });
    });

    describe("[PUT] /api/search/company/keyword", () => {
      it("should update with a `200` for job search", async () => {
        const { status, body } = await request(app)
          .put(`/api/search/company/keyword?title=${jobResponse.title}`)
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
    describe("[UPDATE] /api/", () => {
      it("should respond with a `200` status code for deleted company", async () => {
        const { status, body } = await request(app)
          .put(`/api/jobs/${jobResponse.id}`)
          .send({
            title: "title",
          })
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.data.title).toHaveProperty("title");
      });
    });

    describe("[DELETE] /api/jobs", () => {
      it("should respond with a `200` status code for deleted address", async () => {
        const { status, body } = await request(app)
          .delete(`/api/jobs/${jobResponse.id}`)
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
      });
    });
  });
});
