import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "./../src/app.module";
import {
  getNextValidCPF,
  getNextValidCNPJ,
  getUniquePhone,
} from "./test-helpers";

describe("Producer (e2e)", () => {
  let app: INestApplication;
  let createdProducerId: string;

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

  afterAll(async () => {
    // Cleanup: delete the created producer if it exists
    if (createdProducerId) {
      try {
        await request(app.getHttpServer()).delete(
          `/producer/${createdProducerId}`,
        );
      } catch {
        // Ignore errors during cleanup
      }
    }
    await app.close();
  });

  describe("/producer (GET)", () => {
    it("should return an array of producers", () => {
      return request(app.getHttpServer())
        .get("/producer")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("id");
            expect(res.body[0]).toHaveProperty("cpfCnpj");
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("phone");
            expect(res.body[0]).toHaveProperty("personType");
          }
        });
    });
  });

  describe("/producer (POST)", () => {
    it("should create a new producer with valid CPF", () => {
      const newProducer = {
        cpfCnpj: getNextValidCPF(),
        name: "Test Producer E2E",
        phone: getUniquePhone(),
        personType: "FISICA",
      };

      return request(app.getHttpServer())
        .post("/producer")
        .send(newProducer)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.name).toBe(newProducer.name);
          expect(res.body.personType).toBe(newProducer.personType);
          createdProducerId = res.body.id;
        });
    });

    it("should create a new producer with valid CNPJ", () => {
      const newProducer = {
        cpfCnpj: getNextValidCNPJ(),
        name: "Test Company E2E",
        phone: getUniquePhone(),
        personType: "JURIDICA",
      };

      return request(app.getHttpServer())
        .post("/producer")
        .send(newProducer)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.name).toBe(newProducer.name);
          expect(res.body.personType).toBe(newProducer.personType);
          // Clean up this one immediately
          request(app.getHttpServer()).delete(`/producer/${res.body.id}`);
        });
    });

    it("should fail with invalid CPF/CNPJ", () => {
      const invalidProducer = {
        cpfCnpj: "123.456.789-00",
        name: "Invalid Producer",
        phone: "(11) 99999-8888",
        personType: "FISICA",
      };

      return request(app.getHttpServer())
        .post("/producer")
        .send(invalidProducer)
        .expect(400);
    });

    it("should fail without required fields", () => {
      const incompleteProducer = {
        cpfCnpj: "470.332.457-18",
        phone: "(11) 99999-8888",
      };

      return request(app.getHttpServer())
        .post("/producer")
        .send(incompleteProducer)
        .expect(400);
    });

    it("should fail with invalid personType", () => {
      const invalidProducer = {
        cpfCnpj: "470.332.457-18",
        name: "Test Producer",
        phone: "(11) 99999-8888",
        personType: "INVALID",
      };

      return request(app.getHttpServer())
        .post("/producer")
        .send(invalidProducer)
        .expect(400);
    });
  });

  describe("/producer/:id (PUT)", () => {
    it("should update a producer", async () => {
      // First, get an existing producer
      const producers = await request(app.getHttpServer()).get("/producer");

      if (producers.body.length > 0) {
        const producerId = producers.body[0].id;
        const updateData = {
          name: "Updated Producer Name E2E",
          phone: "(11) 91111-2222",
          personType: producers.body[0].personType,
        };

        return request(app.getHttpServer())
          .put(`/producer/${producerId}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body.name).toBe(updateData.name);
            expect(res.body.phone).toBe(updateData.phone);
          });
      }
    });

    it("should fail to update with invalid data", async () => {
      const producers = await request(app.getHttpServer()).get("/producer");

      if (producers.body.length > 0) {
        const producerId = producers.body[0].id;
        const invalidUpdate = {
          personType: "INVALID_TYPE",
        };

        return request(app.getHttpServer())
          .put(`/producer/${producerId}`)
          .send(invalidUpdate)
          .expect(400);
      }
    });
  });

  describe("/producer/:id/total-area (GET)", () => {
    it("should return total area for a producer", async () => {
      const producers = await request(app.getHttpServer()).get("/producer");

      if (producers.body.length > 0) {
        const producerId = producers.body[0].id;

        return request(app.getHttpServer())
          .get(`/producer/${producerId}/total-area`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty("totalArea");
            expect(typeof res.body.totalArea).toBe("number");
            expect(res.body.totalArea).toBeGreaterThanOrEqual(0);
          });
      }
    });
  });

  describe("/producer/:id (DELETE)", () => {
    it("should delete a producer", async () => {
      // Create a producer to delete
      const newProducer = {
        cpfCnpj: getNextValidCPF(),
        name: "Producer To Delete",
        phone: getUniquePhone(),
        personType: "FISICA",
      };

      const createResponse = await request(app.getHttpServer())
        .post("/producer")
        .send(newProducer);

      expect(createResponse.status).toBe(201);
      const producerId = String(createResponse.body.id);

      const deleteResponse = await request(app.getHttpServer()).delete(
        `/producer/${producerId}`,
      );

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.text).toContain("deleted succesfully");
    });
  });
});
