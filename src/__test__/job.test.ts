import request from "supertest";
import { createServer } from "../utils/createServer";
import { connectionScript, prisma } from "../scripts";
import { companyInput, jobInput, userInput, salaryInput } from "../utils/types";

const app = createServer();

let accessResponse: string;
let jobResponse: any;

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

  describe("[POST] /api/company", () => {
    it("should respond with a `201` status code", async () => {
      const { status, body } = await request(app)
        .post("/api/company")
        .send({
          ...companyInput,
        })
        .set("Authorization", `Bearer ${accessResponse}`);
      expect(status).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });

  describe("/api/jobs", () => {
    describe("[POST] /api/jobs", () => {
      it("should respond with a `201` status code", async () => {
        const { status, body } = await request(app)
          .post(`/api/jobs`)
          .send({
            ...jobInput,
            ...salaryInput,
          })
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(201);
        expect(body.status).toBe(true);
        jobResponse = body.data;
      });
    });

    describe("[GET] /api/jobs", () => {
      it("should respond with a `201` status code for all jobs", async () => {
        const { status, body } = await request(app).get("/api/jobs");
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
      });
    });

    describe("[GET] /api/jobs/:id", () => {
      it("should respond with a `200` status code and job details", async () => {
        const { status, body } = await request(app).get(
          `/api/jobs/${jobResponse.id}`,
        );
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        // expect(body).toHaveProperty("message");
      });
    });

    // describe("[GET] /api/jobs/filter", () => {
    //   it("should respond with a `200` status code and job filter", async () => {
    //     const { status, body } = await request(app).get(
    //       `/api/search/jobs/filter?currency=${jobResponse.currency}`
    //     );
    //     expect(status).toBe(201);
    //     expect(body).toHaveProperty("status");
    //   });
    // });

    describe("[GET] /api/jobs/location/:location", () => {
      it("should respond with a `404` status code and a list of matching companies", async () => {
        const { status, body } = await request(app).get(
          `/api/jobs/location/${jobInput.street}`,
        );
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
      });
    });

    // describe("[PUT] /api/search/job/keyword", () => {
    //   it("should update with a `200` for job search", async () => {
    //     const { status, body } = await request(app)
    //       .put(`/api/search/job/keyword?title=${jobResponse.title}`)
    //       .set("Authorization", `Bearer ${accessResponse}`)
    //       .send({
    //         name: "jobname",
    //         website: "website",
    //         size: "30",
    //       });
    //     expect(status).toBe(200);
    //   });
    // });

    // describe("[UPDATE] /api/", () => {
    //   it("should respond with a `200` status code for deleted job", async () => {
    //     const { status, body } = await request(app)
    //       .put(`/api/jobs/${jobResponse.id}`)
    //       .send({
    //         title: "title",
    //       })
    //       .set("Authorization", `Bearer ${accessResponse}`);
    //     expect(status).toBe(200);
    //     expect(body.data.title).toHaveProperty("title");
    //   });
    // });

    // describe("[DELETE] /api/jobs", () => {
    //   it("should respond with a `200` status code for deleted address", async () => {
    //     const { status, body } = await request(app)
    //       .delete(`/api/jobs/${jobResponse.id}`)
    //       .set("Authorization", `Bearer ${accessResponse}`);
    //     expect(status).toBe(200);
    //     expect(body.data.id).toBe(jobResponse.id);
    //     expect(body.data.title).toBe(jobResponse.title);
    //     expect(body.data.subtitle).toBe(jobResponse.subtitle);
    //     expect(body.data.skills).toBe(jobResponse.skills);
    //   });
    // });
  });
});
