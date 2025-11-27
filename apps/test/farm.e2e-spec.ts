import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request = require("supertest");
import { AppModule } from "./../src/app.module";
import { getNextValidCPF, getUniquePhone } from "./test-helpers";

describe("Farm (e2e)", () => {
  let app: INestApplication;
  let createdFarmId: string;
  let testProducerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(async () => {
    // Create a test producer for farm operations before each test
    const testProducer = {
      cpfCnpj: getNextValidCPF(),
      name: `Test Producer For Farms ${Date.now()}`,
      phone: getUniquePhone(),
      personType: "FISICA",
    };

    const producerResponse = await request(app.getHttpServer())
      .post("/producer")
      .send(testProducer);

    testProducerId = String(producerResponse.body.id);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/farm (GET)", () => {
    it("should return an array of farms", () => {
      return request(app.getHttpServer())
        .get("/farm")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("id");
            expect(res.body[0]).toHaveProperty("producer_id");
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("city");
            expect(res.body[0]).toHaveProperty("state");
            expect(res.body[0]).toHaveProperty("totalArea");
            expect(res.body[0]).toHaveProperty("productiveArea");
            expect(res.body[0]).toHaveProperty("nonProductiveArea");
          }
        });
    });
  });

  describe("/farm (POST)", () => {
    it("should create a new farm with valid data", () => {
      const newFarm = {
        producer_id: testProducerId,
        name: "Test Farm E2E",
        city: "São Paulo",
        state: "SP",
        totalArea: 1000,
        productiveArea: 700,
        nonProductiveArea: 300,
      };

      return request(app.getHttpServer())
        .post("/farm")
        .send(newFarm)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.name).toBe(newFarm.name);
          expect(res.body.city).toBe(newFarm.city);
          expect(res.body.state).toBe(newFarm.state);
          expect(res.body.totalArea).toBe(newFarm.totalArea);
          createdFarmId = res.body.id;
        });
    });

    it("should fail when productive + non-productive area exceeds total area", () => {
      const invalidFarm = {
        producer_id: testProducerId,
        name: "Invalid Farm",
        city: "Rio de Janeiro",
        state: "RJ",
        totalArea: 1000,
        productiveArea: 800,
        nonProductiveArea: 300, // 800 + 300 = 1100 > 1000
      };

      return request(app.getHttpServer())
        .post("/farm")
        .send(invalidFarm)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain("área");
        });
    });

    it("should fail without required fields", () => {
      const incompleteFarm = {
        producer_id: testProducerId,
        name: "Incomplete Farm",
      };

      return request(app.getHttpServer())
        .post("/farm")
        .send(incompleteFarm)
        .expect(400);
    });

    it("should create farm with areas summing exactly to total area", () => {
      const perfectFarm = {
        producer_id: testProducerId,
        name: "Perfect Farm E2E",
        city: "Campinas",
        state: "SP",
        totalArea: 1500,
        productiveArea: 1000,
        nonProductiveArea: 500, // 1000 + 500 = 1500 (exact match)
      };

      return request(app.getHttpServer())
        .post("/farm")
        .send(perfectFarm)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.totalArea).toBe(perfectFarm.totalArea);
          // Clean up immediately
          request(app.getHttpServer()).delete(`/farm/${res.body.id}`);
        });
    });

    it("should create farm with areas summing less than total area", () => {
      const validFarm = {
        producer_id: testProducerId,
        name: "Valid Farm E2E",
        city: "Curitiba",
        state: "PR",
        totalArea: 2000,
        productiveArea: 1000,
        nonProductiveArea: 500, // 1000 + 500 = 1500 < 2000 (valid)
      };

      return request(app.getHttpServer())
        .post("/farm")
        .send(validFarm)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          // Clean up immediately
          request(app.getHttpServer()).delete(`/farm/${res.body.id}`);
        });
    });
  });

  describe("/farm/:id (PUT)", () => {
    it("should update a farm with valid data", async () => {
      // Use the created farm
      if (createdFarmId) {
        const updateData = {
          name: "Updated Farm Name E2E",
          totalArea: 1200,
          productiveArea: 800,
          nonProductiveArea: 400,
        };

        return request(app.getHttpServer())
          .put(`/farm/${createdFarmId}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body.name).toBe(updateData.name);
            expect(res.body.totalArea).toBe(updateData.totalArea);
          });
      }
    });

    it("should fail to update when areas exceed total", async () => {
      if (createdFarmId) {
        const invalidUpdate = {
          totalArea: 1000,
          productiveArea: 900,
          nonProductiveArea: 200, // 900 + 200 = 1100 > 1000
        };

        return request(app.getHttpServer())
          .put(`/farm/${createdFarmId}`)
          .send(invalidUpdate)
          .expect(400);
      }
    });

    it("should partially update farm", async () => {
      if (createdFarmId) {
        const partialUpdate = {
          name: "Partially Updated Farm",
        };

        return request(app.getHttpServer())
          .put(`/farm/${createdFarmId}`)
          .send(partialUpdate)
          .expect(200)
          .expect((res) => {
            expect(res.body.name).toBe(partialUpdate.name);
          });
      }
    });
  });

  describe("/farm/:id (DELETE)", () => {
    it("should delete a farm", async () => {
      // Create a farm to delete
      const farmToDelete = {
        producer_id: testProducerId,
        name: "Farm To Delete",
        city: "Brasília",
        state: "DF",
        totalArea: 800,
        productiveArea: 500,
        nonProductiveArea: 300,
      };

      const createResponse = await request(app.getHttpServer())
        .post("/farm")
        .send(farmToDelete);

      const farmId = String(createResponse.body.id);

      const deleteResponse = await request(app.getHttpServer()).delete(
        `/farm/${farmId}`,
      );

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.text).toContain("deleted succesfully");
    });
  });

  describe("Farm Business Logic", () => {
    it("should handle zero areas", () => {
      const zeroAreaFarm = {
        producer_id: testProducerId,
        name: "Zero Area Farm",
        city: "Salvador",
        state: "BA",
        totalArea: 1000,
        productiveArea: 0,
        nonProductiveArea: 0,
      };

      return request(app.getHttpServer())
        .post("/farm")
        .send(zeroAreaFarm)
        .expect(201)
        .expect((res) => {
          expect(res.body.productiveArea).toBe(0);
          expect(res.body.nonProductiveArea).toBe(0);
          // Clean up
          request(app.getHttpServer()).delete(`/farm/${res.body.id}`);
        });
    });

    it("should handle large area values", () => {
      const largeFarm = {
        producer_id: testProducerId,
        name: "Large Farm",
        city: "Campo Grande",
        state: "MS",
        totalArea: 999999.99,
        productiveArea: 500000,
        nonProductiveArea: 400000,
      };

      return request(app.getHttpServer())
        .post("/farm")
        .send(largeFarm)
        .expect(201)
        .expect((res) => {
          expect(res.body.totalArea).toBe(largeFarm.totalArea);
          // Clean up
          request(app.getHttpServer()).delete(`/farm/${res.body.id}`);
        });
    });
  });
});
