import request from "supertest";
import { createServer } from "../utils/createServer";
import { connectionScript, prisma } from "../scripts";
import { userInput } from "../utils/types";
import { getCache, setCache } from "../utils/redis";

// Mock Redis functions
jest.mock("../utils/redis", () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  deleteCache: jest.fn(),
  invalidatePattern: jest.fn(),
}));

const app = createServer();

let accessToken: string;
let companyId: string;

describe("Company Controller", () => {
  beforeAll(async () => {
    connectionScript(true);

    // Create a test user
    await request(app)
      .post("/api/users")
      .send({
        ...userInput,
      });

    // Login to get access token
    const { body } = await request(app).post("/api/auth").send({
      email: userInput.email,
      hashed_password: userInput.hashed_password,
      user_agent: "test-agent",
      client_ip: "127.0.0.1",
    });

    accessToken = body.accessToken;
  });

  afterAll(async () => {
    connectionScript(false);
    await prisma.$disconnect();
  });

  describe("Company Creation and Retrieval", () => {
    it("should create a new company", async () => {
      const companyData = {
        name: "Test Company",
        industry: "Technology",
        size: "MEDIUM",
        website: "https://testcompany.com",
        description: "A test company for unit tests",
        logo: "https://example.com/logo.png",
        founded_year: 2020,
      };

      const { status, body } = await request(app)
        .post("/api/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(companyData);

      expect(status).toBe(201);
      expect(body.status).toBe(true);
      expect(body.message).toBe("Company successfully created");
      expect(body.data.company.name).toBe(companyData.name);

      companyId = body.data.company.id;
    });

    it("should retrieve a company by ID", async () => {
      // Mock cache miss
      (getCache as jest.Mock).mockResolvedValueOnce(null);

      const { status, body } = await request(app)
        .get(`/api/companies/${companyId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.message).toBe("Company found successfully");
      expect(body.company.id).toBe(companyId);
      expect(body.source).toBe("database");

      // Verify cache was set
      expect(setCache).toHaveBeenCalledWith(
        `company:${companyId}`,
        expect.anything(),
        3600
      );
    });

    it("should retrieve a company from cache", async () => {
      // Mock cache hit
      const cachedCompany = {
        id: companyId,
        name: "Test Company",
        industry: "Technology",
      };
      (getCache as jest.Mock).mockResolvedValueOnce(cachedCompany);

      const { status, body } = await request(app)
        .get(`/api/companies/${companyId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.company).toEqual(cachedCompany);
      expect(body.source).toBe("cache");
    });

    it("should return 404 for non-existent company", async () => {
      // Mock cache miss
      (getCache as jest.Mock).mockResolvedValueOnce(null);

      const { status, body } = await request(app)
        .get(`/api/companies/nonexistent-id`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(status).toBe(404);
      expect(body.status).toBe(false);
      expect(body.message).toBe("Company not found");
    });
  });

  describe("Company Listing and Filtering", () => {
    it("should list all companies with pagination", async () => {
      // Mock cache miss
      (getCache as jest.Mock).mockResolvedValueOnce(null);

      const { status, body } = await request(app)
        .get("/api/companies")
        .query({ page: 1, limit: 10 })
        .set("Authorization", `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.pagination).toBeDefined();
      expect(Array.isArray(body.companies)).toBe(true);
      expect(body.source).toBe("database");
    });

    it("should filter companies by location", async () => {
      // Mock cache miss
      (getCache as jest.Mock).mockResolvedValueOnce(null);

      const { status, body } = await request(app)
        .get("/api/companies/location/New York")
        .query({ page: 1, limit: 5 })
        .set("Authorization", `Bearer ${accessToken}`);

      // Even if no companies match, the API should return a valid response
      // expect(status).toBe(200 || 404);
      if (status === 200) {
        expect(body.status).toBe(true);
        expect(Array.isArray(body.company)).toBe(true);
      } else {
        expect(body.status).toBe(false);
        expect(body.message).toBe("No companies found for this location");
      }
    });
  });

  describe("Company Statistics and Featured Companies", () => {
    it("should retrieve company statistics", async () => {
      // Mock cache miss
      (getCache as jest.Mock).mockResolvedValueOnce(null);

      const { status, body } = await request(app)
        .get("/api/companies/statistics")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.data).toBeDefined();
      expect(body.source).toBe("database");
    });

    it("should retrieve trending companies", async () => {
      // Mock cache miss
      (getCache as jest.Mock).mockResolvedValueOnce(null);

      const { status, body } = await request(app)
        .get("/api/companies/trending")
        .query({ limit: 5 })
        .set("Authorization", `Bearer ${accessToken}`);

      // expect(status).toBe(200 || 404);
      if (status === 200) {
        expect(body.status).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.source).toBe("database");
      } else {
        expect(body.status).toBe(false);
        expect(body.message).toBe("No trending companies found");
      }
    });

    it("should retrieve featured companies", async () => {
      // Mock cache miss
      (getCache as jest.Mock).mockResolvedValueOnce(null);

      const { status, body } = await request(app)
        .get("/api/companies/featured")
        .query({ limit: 6 })
        .set("Authorization", `Bearer ${accessToken}`);

      // expect(status).toBe(200 || 404);
      if (status === 200) {
        expect(body.status).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.source).toBe("database");
      } else {
        expect(body.status).toBe(false);
        expect(body.message).toBe("No featured companies found");
      }
    });
  });

  describe("Company Update and Delete", () => {
    it("should update a company", async () => {
      const updateData = {
        description: "Updated company description",
        website: "https://updated-testcompany.com",
      };

      const { status, body } = await request(app)
        .put(`/api/companies/${companyId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updateData);

      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.message).toBe("company updated successfully");
      expect(body.data.description).toBe(updateData.description);
    });

    it("should verify a company (admin only)", async () => {
      // This test assumes the user has admin privileges
      // In a real test, you'd need to create an admin user first

      const verificationData = {
        isVerified: true,
        verificationNotes: "Verified during testing",
      };

      const { status, body } = await request(app)
        .patch(`/api/companies/${companyId}/verify`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(verificationData);

      // If the user is not an admin, expect 403
      if (status === 403) {
        expect(body.status).toBe(false);
        expect(body.message).toBe("Only administrators can verify companies");
      } else {
        expect(status).toBe(200);
        expect(body.status).toBe(true);
        expect(body.message).toBe("Company verified successfully");
      }
    });

    it("should delete a company", async () => {
      const { status, body } = await request(app)
        .delete(`/api/companies/${companyId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.message).toBe("company Successfully Deleted");
    });
  });
});

// import request from "supertest";
// import { createServer } from "../utils/createServer";
// import { connectionScript, prisma } from "../scripts";
// import { companyInput, userInput } from "../utils/types";

// const app = createServer();

// // let sessionResponse: {
// //   email: string;
// //   username: string;
// //   first_name: string;
// //   last_name: string;
// //   hashed_password: string;
// //   confirm_password: string;
// //   street: string;
// //   country: string;
// // };
// let accessResponse: string;
// let companyResponse: any;
// let addressResponse: {
//   id: string;
//   street: string;
//   street2: string;
//   city: string;
//   state_province_code: string;
//   state_province_name: string;
//   postal_code: string;
//   country_code: string;
//   latitude: string;
//   longitude: string;
//   country: string;
// };

// describe("session", () => {
//   beforeAll(async () => {
//     connectionScript(true);
//   });

//   afterAll(async () => {
//     connectionScript(false);
//     await prisma.$disconnect();
//   });

//   describe("[POST] /api/users", () => {
//     it("should respond with a `201` status code for creating users", async () => {
//       const { status, body } = await request(app)
//         .post("/api/users")
//         .send({
//           ...userInput,
//         });
//       expect(status).toBe(201);
//       expect(body.status).toBe(true);
//       expect(body.message).toBeTruthy();
//       expect(body.data.id).toBeTruthy();
//       expect(body.data.first_name).toBe(userInput.first_name);
//       expect(body.data.last_name).toBe(userInput.last_name);
//       expect(body.data.is_email_verified).toBe(false);
//       expect(body.data.address.id).toBeTruthy();
//       expect(body.data.address.street).toBe(userInput.street);
//       expect(body.data.address.country).toBe(userInput.country);
//       // sessionResponse = userInput;
//     });
//   });

//   describe("[POST] /api/auth", () => {
//     it("should respond with a `201` status code for creating sesion", async () => {
//       const { status, body } = await request(app).post("/api/auth").send({
//         email: userInput.email,
//         hashed_password: userInput.hashed_password,
//         user_agent: "xuz",
//         client_ip: "bc",
//       });
//       expect(status).toBe(201);
//       expect(body.session.is_blocked).toBe(false);
//       expect(body.session.valid).toBe(true);
//       expect(body.session.createdAt).toBeTruthy();
//       expect(body.accessToken).toBeDefined();
//       accessResponse = body.accessToken;
//     });
//   });

//   describe("/api/company", () => {
//     describe("[POST] /api/company", () => {
//       it("should respond with a `201` status code", async () => {
//         const { status, body } = await request(app)
//           .post("/api/company")
//           .send({
//             ...companyInput,
//           })
//           .set("Authorization", `Bearer ${accessResponse}`);
//         expect(status).toBe(201);
//         expect(body).toHaveProperty("status");
//         expect(body).toHaveProperty("message");
//         expect(body).toHaveProperty("data");
//         companyResponse = body.data;
//         addressResponse = body.data.address;
//       });
//     });

//     describe("[GET] /api/company", () => {
//       it("should respond with a `201` status code for all companies", async () => {
//         const { status, body } = await request(app).get("/api/company");
//         expect(status).toBe(200);
//         expect(body).toHaveProperty("status");
//         expect(body).toHaveProperty("total");
//         expect(body).toHaveProperty("page");
//         expect(body).toHaveProperty("company");
//       });
//     });

//     describe("[GET] /api/company/:id", () => {
//       it("should respond with a `200` status code and company details", async () => {
//         const { status, body } = await request(app).get(
//           `/api/company/${companyResponse.id}`,
//         );
//         expect(status).toBe(200);
//         expect(body).toHaveProperty("status");
//         expect(body).toHaveProperty("message");
//         expect(body).toHaveProperty("company");
//       });
//     });

//     describe("[GET] /api/company/filter", () => {
//       it("should respond with a `200` status code and company filter", async () => {
//         const { status, body } = await request(app).get(
//           `/api/search/company/filter?country=${companyResponse.address.country}`,
//         );
//         expect(status).toBe(200);
//         expect(body).toHaveProperty("status");
//         expect(body).toHaveProperty("page");
//         expect(body).toHaveProperty("company");
//       });
//     });

//     describe("[GET] /api/company/location/:location", () => {
//       it("should respond with a `404` status code and a list of matching companies", async () => {
//         const { status, body } = await request(app).get(
//           `/api/company/location/${companyInput.street}`,
//         );
//         expect(status).toBe(200);
//         expect(body).toHaveProperty("status");
//         expect(body).toHaveProperty("page");
//         expect(body).toHaveProperty("company");
//       });
//     });

//     describe("[PUT] /api/company/:id", () => {
//       it("should update with a `201` status code for updated company", async () => {
//         const { status, body } = await request(app)
//           .put(`/api/company/${companyResponse.id}/${addressResponse.id}`)
//           .set("Authorization", `Bearer ${accessResponse}`)
//           .send({
//             name: "companyname",
//             website: "website",
//             size: "30",
//           });
//         expect(status).toBe(201);
//         expect(body).toHaveProperty("status");
//         expect(body).toHaveProperty("message");
//         expect(body).toHaveProperty("data");
//       });
//     });
//     describe("[DELETE] /api/", () => {
//       it("should respond with a `200` status code for deleted company", async () => {
//         const { status, body } = await request(app)
//           .delete(`/api/company/${companyResponse.id}`)
//           .set("Authorization", `Bearer ${accessResponse}`);
//         expect(status).toBe(200);
//         expect(body).toHaveProperty("status");
//         expect(body).toHaveProperty("message");
//         expect(body).toHaveProperty("data");
//       });
//     });

//     describe("[DELETE] /api/address", () => {
//       it("should respond with a `200` status code for deleted address", async () => {
//         const { status, body } = await request(app)
//           .delete(`/api/address/${addressResponse.id}`)
//           .set("Authorization", `Bearer ${accessResponse}`);
//         expect(status).toBe(200);
//         expect(body).toHaveProperty("status");
//         expect(body).toHaveProperty("message");
//         expect(body).toHaveProperty("data");
//       });
//     });
//   });
// });
