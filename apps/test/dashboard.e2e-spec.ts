import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "./../src/app.module";
import { getNextValidCPF, getUniquePhone } from "./test-helpers";

describe("Dashboard (e2e)", () => {
  let app: INestApplication;
  let testProducerId: string;
  let testFarmIds: string[] = [];

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
    testFarmIds = [];

    // Create test producer
    const testProducer = {
      cpfCnpj: getNextValidCPF(),
      name: `Dashboard Test Producer ${Date.now()}`,
      phone: getUniquePhone(),
      personType: "FISICA",
    };

    const producerResponse = await request(app.getHttpServer())
      .post("/producer")
      .send(testProducer);

    testProducerId = String(producerResponse.body.id);

    // Create test farms in different states
    const farms = [
      {
        producer_id: testProducerId,
        name: `Dashboard Farm SP ${Date.now()}`,
        city: "São Paulo",
        state: "SP",
        totalArea: 1000,
        productiveArea: 700,
        nonProductiveArea: 300,
      },
      {
        producer_id: testProducerId,
        name: `Dashboard Farm MG ${Date.now()}`,
        city: "Belo Horizonte",
        state: "MG",
        totalArea: 1500,
        productiveArea: 1000,
        nonProductiveArea: 500,
      },
      {
        producer_id: testProducerId,
        name: `Dashboard Farm RJ ${Date.now()}`,
        city: "Rio de Janeiro",
        state: "RJ",
        totalArea: 800,
        productiveArea: 500,
        nonProductiveArea: 300,
      },
    ];

    for (const farm of farms) {
      const farmResponse = await request(app.getHttpServer())
        .post("/farm")
        .send(farm);
      testFarmIds.push(String(farmResponse.body.id));
    }

    // Create crops for the farms
    const crops = [
      { farm_id: testFarmIds[0], year: 2024, crop: "Soja" },
      { farm_id: testFarmIds[0], year: 2024, crop: "Milho" },
      { farm_id: testFarmIds[1], year: 2024, crop: "Café" },
      { farm_id: testFarmIds[1], year: 2024, crop: "Soja" },
      { farm_id: testFarmIds[2], year: 2024, crop: "Cana de Açúcar" },
    ];

    for (const crop of crops) {
      await request(app.getHttpServer()).post("/crop").send(crop);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/dashboard (GET)", () => {
    it("should return dashboard data with correct structure", () => {
      return request(app.getHttpServer())
        .get("/dashboard")
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("totalArea");
          expect(res.body).toHaveProperty("productiveArea");
          expect(res.body).toHaveProperty("nonProductiveArea");
          expect(res.body).toHaveProperty("areaByState");
          expect(res.body).toHaveProperty("areaByCrop");
        });
    });

    it("should have numeric values for areas", () => {
      return request(app.getHttpServer())
        .get("/dashboard")
        .expect(200)
        .expect((res) => {
          expect(typeof res.body.totalArea).toBe("number");
          expect(typeof res.body.productiveArea).toBe("number");
          expect(typeof res.body.nonProductiveArea).toBe("number");
          expect(res.body.totalArea).toBeGreaterThanOrEqual(0);
          expect(res.body.productiveArea).toBeGreaterThanOrEqual(0);
          expect(res.body.nonProductiveArea).toBeGreaterThanOrEqual(0);
        });
    });

    it("should return area breakdown by state", () => {
      return request(app.getHttpServer())
        .get("/dashboard")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.areaByState)).toBe(true);
          expect(res.body.areaByState.length).toBeGreaterThan(0);

          res.body.areaByState.forEach((stateData: any) => {
            expect(stateData).toHaveProperty("state");
            expect(stateData).toHaveProperty("totalArea");
            expect(stateData).toHaveProperty("productiveArea");
            expect(stateData).toHaveProperty("nonProductiveArea");
            expect(typeof stateData.state).toBe("string");
            expect(typeof stateData.totalArea).toBe("number");
            expect(typeof stateData.productiveArea).toBe("number");
            expect(typeof stateData.nonProductiveArea).toBe("number");
          });
        });
    });

    it("should return area breakdown by crop", () => {
      return request(app.getHttpServer())
        .get("/dashboard")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.areaByCrop)).toBe(true);
          expect(res.body.areaByCrop.length).toBeGreaterThan(0);

          res.body.areaByCrop.forEach((cropData: any) => {
            expect(cropData).toHaveProperty("crop");
            expect(cropData).toHaveProperty("totalArea");
            expect(cropData).toHaveProperty("productiveArea");
            expect(cropData).toHaveProperty("nonProductiveArea");
            expect(typeof cropData.crop).toBe("string");
            expect(typeof cropData.totalArea).toBe("number");
            expect(typeof cropData.productiveArea).toBe("number");
            expect(typeof cropData.nonProductiveArea).toBe("number");
          });
        });
    });

    it("should include our test states in the dashboard", () => {
      return request(app.getHttpServer())
        .get("/dashboard")
        .expect(200)
        .expect((res) => {
          const states = res.body.areaByState.map((s: any) => s.state);
          expect(states).toContain("SP");
          expect(states).toContain("MG");
          expect(states).toContain("RJ");
        });
    });

    it("should include our test crops in the dashboard", () => {
      return request(app.getHttpServer())
        .get("/dashboard")
        .expect(200)
        .expect((res) => {
          const crops = res.body.areaByCrop.map((c: any) => c.crop);
          expect(crops).toContain("Soja");
          expect(crops).toContain("Milho");
          expect(crops).toContain("Café");
          expect(crops).toContain("Cana de Açúcar");
        });
    });

    it("should have consistent area calculations", () => {
      return request(app.getHttpServer())
        .get("/dashboard")
        .expect(200)
        .expect((res) => {
          // Productive + Non-productive should equal or be less than total
          const sumAreas = res.body.productiveArea + res.body.nonProductiveArea;
          expect(sumAreas).toBeLessThanOrEqual(res.body.totalArea);

          // State areas should sum correctly
          res.body.areaByState.forEach((stateData: any) => {
            const stateSum =
              stateData.productiveArea + stateData.nonProductiveArea;
            expect(stateSum).toBeLessThanOrEqual(stateData.totalArea);
          });

          // Crop areas should sum correctly
          res.body.areaByCrop.forEach((cropData: any) => {
            const cropSum =
              cropData.productiveArea + cropData.nonProductiveArea;
            expect(cropSum).toBeLessThanOrEqual(cropData.totalArea);
          });
        });
    });
  });

  describe("Dashboard Data Integrity", () => {
    it("should update dashboard when new farm is added", async () => {
      const beforeDashboard = await request(app.getHttpServer()).get(
        "/dashboard",
      );
      const initialTotalArea = beforeDashboard.body.totalArea;

      // Add a new farm
      const newFarm = {
        producer_id: testProducerId,
        name: "New Dashboard Test Farm",
        city: "Curitiba",
        state: "PR",
        totalArea: 2000,
        productiveArea: 1500,
        nonProductiveArea: 500,
      };

      const farmResponse = await request(app.getHttpServer())
        .post("/farm")
        .send(newFarm);

      const newFarmId = farmResponse.body.id;

      // Check updated dashboard
      const afterDashboard = await request(app.getHttpServer()).get(
        "/dashboard",
      );

      expect(afterDashboard.body.totalArea).toBeGreaterThan(initialTotalArea);

      // Clean up
      await request(app.getHttpServer()).delete(`/farm/${newFarmId}`);
    });

    it("should reflect state distribution correctly", async () => {
      const dashboard = await request(app.getHttpServer()).get("/dashboard");

      // Verify that each state has appropriate data
      const stateMap = new Map();
      dashboard.body.areaByState.forEach((state: any) => {
        stateMap.set(state.state, state);
      });

      // Each state should have positive areas
      stateMap.forEach((stateData) => {
        expect(stateData.totalArea).toBeGreaterThan(0);
      });
    });

    it("should reflect crop distribution correctly", async () => {
      const dashboard = await request(app.getHttpServer()).get("/dashboard");

      // Verify that each crop has appropriate data
      const cropMap = new Map();
      dashboard.body.areaByCrop.forEach((crop: any) => {
        cropMap.set(crop.crop, crop);
      });

      // Each crop should have positive areas
      cropMap.forEach((cropData) => {
        expect(cropData.totalArea).toBeGreaterThan(0);
      });
    });
  });

  describe("Dashboard Edge Cases", () => {
    it("should handle farms with zero productive area", async () => {
      const zeroProductiveFarm = {
        producer_id: testProducerId,
        name: "Zero Productive Farm",
        city: "Goiânia",
        state: "GO",
        totalArea: 1000,
        productiveArea: 0,
        nonProductiveArea: 1000,
      };

      const farmResponse = await request(app.getHttpServer())
        .post("/farm")
        .send(zeroProductiveFarm);

      const dashboard = await request(app.getHttpServer()).get("/dashboard");

      expect(dashboard.body).toHaveProperty("totalArea");

      // Clean up
      await request(app.getHttpServer()).delete(
        `/farm/${farmResponse.body.id}`,
      );
    });

    it("should handle farms with zero non-productive area", async () => {
      const zeroNonProductiveFarm = {
        producer_id: testProducerId,
        name: "Zero Non-Productive Farm",
        city: "Fortaleza",
        state: "CE",
        totalArea: 1000,
        productiveArea: 1000,
        nonProductiveArea: 0,
      };

      const farmResponse = await request(app.getHttpServer())
        .post("/farm")
        .send(zeroNonProductiveFarm);

      const dashboard = await request(app.getHttpServer()).get("/dashboard");

      expect(dashboard.body).toHaveProperty("totalArea");

      // Clean up
      await request(app.getHttpServer()).delete(
        `/farm/${farmResponse.body.id}`,
      );
    });
  });
});
