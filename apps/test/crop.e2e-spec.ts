import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request = require("supertest");
import { AppModule } from "./../src/app.module";
import { getNextValidCPF, getUniquePhone } from "./test-helpers";

describe("Crop (e2e)", () => {
  let app: INestApplication;
  let testProducerId: string;
  let testFarmId: string;

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
    // Create a test producer before each test
    const testProducer = {
      cpfCnpj: getNextValidCPF(),
      name: `Test Producer For Crops ${Date.now()}`,
      phone: getUniquePhone(),
      personType: "FISICA",
    };

    const producerResponse = await request(app.getHttpServer())
      .post("/producer")
      .send(testProducer);

    testProducerId = String(producerResponse.body.id);

    // Create a test farm
    const testFarm = {
      producer_id: testProducerId,
      name: `Test Farm For Crops ${Date.now()}`,
      city: "São Paulo",
      state: "SP",
      totalArea: 2000,
      productiveArea: 1500,
      nonProductiveArea: 500,
    };

    const farmResponse = await request(app.getHttpServer())
      .post("/farm")
      .send(testFarm);

    testFarmId = String(farmResponse.body.id);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/crop (GET)", () => {
    it("should return an array of crops", () => {
      return request(app.getHttpServer())
        .get("/crop")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("id");
            expect(res.body[0]).toHaveProperty("farm_id");
            expect(res.body[0]).toHaveProperty("year");
            expect(res.body[0]).toHaveProperty("crop");
          }
        });
    });
  });

  describe("/crop (POST)", () => {
    it("should create a new crop with valid data", () => {
      const newCrop = {
        farm_id: testFarmId,
        year: 2024,
        crop: "Soja",
      };

      return request(app.getHttpServer())
        .post("/crop")
        .send(newCrop)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.farm_id).toBe(testFarmId);
          expect(res.body.year).toBe(newCrop.year);
          expect(res.body.crop).toBe(newCrop.crop);
        });
    });

    it("should create multiple crops for the same farm", async () => {
      const crops = [
        { farm_id: testFarmId, year: 2024, crop: "Milho" },
        { farm_id: testFarmId, year: 2024, crop: "Café" },
        { farm_id: testFarmId, year: 2025, crop: "Algodão" },
      ];

      for (const crop of crops) {
        const response = await request(app.getHttpServer())
          .post("/crop")
          .send(crop)
          .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body.crop).toBe(crop.crop);
      }
    });

    it("should fail without required fields", () => {
      const incompleteCrop = {
        farm_id: testFarmId,
        year: 2024,
      };

      return request(app.getHttpServer())
        .post("/crop")
        .send(incompleteCrop)
        .expect(400);
    });

    it("should create crop with different year for same farm", () => {
      const newCrop = {
        farm_id: testFarmId,
        year: 2025,
        crop: "Trigo",
      };

      return request(app.getHttpServer())
        .post("/crop")
        .send(newCrop)
        .expect(201)
        .expect((res) => {
          expect(res.body.year).toBe(2025);
        });
    });

    it("should handle various crop types", async () => {
      const cropTypes = [
        "Cana de Açúcar",
        "Arroz",
        "Feijão",
        "Mandioca",
        "Tomate",
      ];

      for (const cropType of cropTypes) {
        const crop = {
          farm_id: testFarmId,
          year: 2024,
          crop: cropType,
        };

        const response = await request(app.getHttpServer())
          .post("/crop")
          .send(crop)
          .expect(201);

        expect(response.body.crop).toBe(cropType);
      }
    });
  });

  describe("Crop Business Logic", () => {
    it("should create crops for multiple years", async () => {
      const years = [2020, 2021, 2022, 2023, 2024, 2025];

      for (const year of years) {
        const crop = {
          farm_id: testFarmId,
          year: year,
          crop: "Soja",
        };

        const response = await request(app.getHttpServer())
          .post("/crop")
          .send(crop)
          .expect(201);

        expect(response.body.year).toBe(year);
      }
    });

    it("should handle the same crop in different years", async () => {
      const crop2023 = {
        farm_id: testFarmId,
        year: 2023,
        crop: "Milho",
      };

      const crop2024 = {
        farm_id: testFarmId,
        year: 2024,
        crop: "Milho",
      };

      const response1 = await request(app.getHttpServer())
        .post("/crop")
        .send(crop2023)
        .expect(201);

      const response2 = await request(app.getHttpServer())
        .post("/crop")
        .send(crop2024)
        .expect(201);

      expect(response1.body.year).toBe(2023);
      expect(response2.body.year).toBe(2024);
      expect(response1.body.crop).toBe(response2.body.crop);
    });
  });

  describe("Crop Integration", () => {
    it("should retrieve all crops after creating multiple", async () => {
      const initialCrops = await request(app.getHttpServer()).get("/crop");
      const initialCount = initialCrops.body.length;

      // Create new crops
      const newCrops = [
        { farm_id: testFarmId, year: 2026, crop: "Banana" },
        { farm_id: testFarmId, year: 2026, crop: "Laranja" },
      ];

      for (const crop of newCrops) {
        await request(app.getHttpServer()).post("/crop").send(crop);
      }

      const finalCrops = await request(app.getHttpServer()).get("/crop");

      expect(finalCrops.body.length).toBeGreaterThan(initialCount);
    });
  });
});
