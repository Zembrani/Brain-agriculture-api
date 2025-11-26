import { Dashboard, DashboardResponseDTO } from "./dashboardDomain";
import { Crop } from "./cropDomain";

describe("Dashboard Domain", () => {
  describe("Dashboard", () => {
    it("should create a Dashboard instance with all required properties", () => {
      const crops: Crop[] = [
        {
          id: "1",
          farm_id: "farm1",
          year: 2024,
          crop: "Soja",
        },
        {
          id: "2",
          farm_id: "farm1",
          year: 2024,
          crop: "Milho",
        },
      ];

      const dashboard = new Dashboard();
      dashboard.id = "farm1";
      dashboard.producer_id = "producer1";
      dashboard.name = "Fazenda São João";
      dashboard.city = "São Paulo";
      dashboard.state = "SP";
      dashboard.totalArea = 1000;
      dashboard.productiveArea = 700;
      dashboard.nonProductiveArea = 300;
      dashboard.crops = crops;

      expect(dashboard).toBeDefined();
      expect(dashboard.id).toBe("farm1");
      expect(dashboard.producer_id).toBe("producer1");
      expect(dashboard.name).toBe("Fazenda São João");
      expect(dashboard.city).toBe("São Paulo");
      expect(dashboard.state).toBe("SP");
      expect(dashboard.totalArea).toBe(1000);
      expect(dashboard.productiveArea).toBe(700);
      expect(dashboard.nonProductiveArea).toBe(300);
      expect(dashboard.crops).toEqual(crops);
      expect(dashboard.crops).toHaveLength(2);
    });

    it("should extend Farm and inherit all its properties", () => {
      const dashboard = new Dashboard();
      dashboard.id = "farm1";
      dashboard.producer_id = "producer1";
      dashboard.name = "Fazenda Test";
      dashboard.city = "Rio de Janeiro";
      dashboard.state = "RJ";
      dashboard.totalArea = 500;
      dashboard.productiveArea = 400;
      dashboard.nonProductiveArea = 100;
      dashboard.crops = [];

      expect(dashboard).toHaveProperty("id");
      expect(dashboard).toHaveProperty("producer_id");
      expect(dashboard).toHaveProperty("name");
      expect(dashboard).toHaveProperty("city");
      expect(dashboard).toHaveProperty("state");
      expect(dashboard).toHaveProperty("totalArea");
      expect(dashboard).toHaveProperty("productiveArea");
      expect(dashboard).toHaveProperty("nonProductiveArea");
      expect(dashboard).toHaveProperty("crops");
    });

    it("should handle empty crops array", () => {
      const dashboard = new Dashboard();
      dashboard.id = "farm1";
      dashboard.producer_id = "producer1";
      dashboard.name = "Fazenda Empty";
      dashboard.city = "Curitiba";
      dashboard.state = "PR";
      dashboard.totalArea = 2000;
      dashboard.productiveArea = 1500;
      dashboard.nonProductiveArea = 500;
      dashboard.crops = [];

      expect(dashboard.crops).toBeDefined();
      expect(dashboard.crops).toEqual([]);
      expect(dashboard.crops).toHaveLength(0);
    });

    it("should handle multiple crops for the same farm", () => {
      const crops: Crop[] = [
        { id: "1", farm_id: "farm1", year: 2024, crop: "Soja" },
        { id: "2", farm_id: "farm1", year: 2024, crop: "Milho" },
        { id: "3", farm_id: "farm1", year: 2024, crop: "Algodão" },
        { id: "4", farm_id: "farm1", year: 2024, crop: "Café" },
      ];

      const dashboard = new Dashboard();
      dashboard.id = "farm1";
      dashboard.producer_id = "producer1";
      dashboard.name = "Fazenda Diversificada";
      dashboard.city = "Goiânia";
      dashboard.state = "GO";
      dashboard.totalArea = 3000;
      dashboard.productiveArea = 2500;
      dashboard.nonProductiveArea = 500;
      dashboard.crops = crops;

      expect(dashboard.crops).toHaveLength(4);
      expect(dashboard.crops[0].crop).toBe("Soja");
      expect(dashboard.crops[1].crop).toBe("Milho");
      expect(dashboard.crops[2].crop).toBe("Algodão");
      expect(dashboard.crops[3].crop).toBe("Café");
    });
  });

  describe("DashboardResponseDTO", () => {
    it("should create a DashboardResponseDTO with all required properties", () => {
      const dashboardResponse = new DashboardResponseDTO();
      dashboardResponse.totalArea = 5000;
      dashboardResponse.productiveArea = 4000;
      dashboardResponse.nonProductiveArea = 1000;
      dashboardResponse.areaByState = [
        {
          state: "SP",
          totalArea: 2000,
          productiveArea: 1500,
          nonProductiveArea: 500,
        },
        {
          state: "MG",
          totalArea: 3000,
          productiveArea: 2500,
          nonProductiveArea: 500,
        },
      ];
      dashboardResponse.areaByCrop = [
        {
          crop: "Soja",
          totalArea: 2500,
          productiveArea: 2000,
          nonProductiveArea: 500,
        },
        {
          crop: "Milho",
          totalArea: 2500,
          productiveArea: 2000,
          nonProductiveArea: 500,
        },
      ];

      expect(dashboardResponse).toBeDefined();
      expect(dashboardResponse.totalArea).toBe(5000);
      expect(dashboardResponse.productiveArea).toBe(4000);
      expect(dashboardResponse.nonProductiveArea).toBe(1000);
      expect(dashboardResponse.areaByState).toHaveLength(2);
      expect(dashboardResponse.areaByCrop).toHaveLength(2);
    });

    it("should have correct structure for areaByState", () => {
      const dashboardResponse = new DashboardResponseDTO();
      dashboardResponse.totalArea = 1000;
      dashboardResponse.productiveArea = 800;
      dashboardResponse.nonProductiveArea = 200;
      dashboardResponse.areaByState = [
        {
          state: "SP",
          totalArea: 1000,
          productiveArea: 800,
          nonProductiveArea: 200,
        },
      ];
      dashboardResponse.areaByCrop = [];

      const stateData = dashboardResponse.areaByState[0];
      expect(stateData).toHaveProperty("state");
      expect(stateData).toHaveProperty("totalArea");
      expect(stateData).toHaveProperty("productiveArea");
      expect(stateData).toHaveProperty("nonProductiveArea");
      expect(stateData.state).toBe("SP");
      expect(stateData.totalArea).toBe(1000);
      expect(stateData.productiveArea).toBe(800);
      expect(stateData.nonProductiveArea).toBe(200);
    });

    it("should have correct structure for areaByCrop", () => {
      const dashboardResponse = new DashboardResponseDTO();
      dashboardResponse.totalArea = 1000;
      dashboardResponse.productiveArea = 800;
      dashboardResponse.nonProductiveArea = 200;
      dashboardResponse.areaByState = [];
      dashboardResponse.areaByCrop = [
        {
          crop: "Soja",
          totalArea: 1000,
          productiveArea: 800,
          nonProductiveArea: 200,
        },
      ];

      const cropData = dashboardResponse.areaByCrop[0];
      expect(cropData).toHaveProperty("crop");
      expect(cropData).toHaveProperty("totalArea");
      expect(cropData).toHaveProperty("productiveArea");
      expect(cropData).toHaveProperty("nonProductiveArea");
      expect(cropData.crop).toBe("Soja");
      expect(cropData.totalArea).toBe(1000);
      expect(cropData.productiveArea).toBe(800);
      expect(cropData.nonProductiveArea).toBe(200);
    });

    it("should handle multiple states", () => {
      const dashboardResponse = new DashboardResponseDTO();
      dashboardResponse.totalArea = 10000;
      dashboardResponse.productiveArea = 8000;
      dashboardResponse.nonProductiveArea = 2000;
      dashboardResponse.areaByState = [
        {
          state: "SP",
          totalArea: 3000,
          productiveArea: 2400,
          nonProductiveArea: 600,
        },
        {
          state: "MG",
          totalArea: 3500,
          productiveArea: 2800,
          nonProductiveArea: 700,
        },
        {
          state: "GO",
          totalArea: 3500,
          productiveArea: 2800,
          nonProductiveArea: 700,
        },
      ];
      dashboardResponse.areaByCrop = [];

      expect(dashboardResponse.areaByState).toHaveLength(3);
      expect(dashboardResponse.areaByState[0].state).toBe("SP");
      expect(dashboardResponse.areaByState[1].state).toBe("MG");
      expect(dashboardResponse.areaByState[2].state).toBe("GO");
    });

    it("should handle multiple crops", () => {
      const dashboardResponse = new DashboardResponseDTO();
      dashboardResponse.totalArea = 10000;
      dashboardResponse.productiveArea = 8000;
      dashboardResponse.nonProductiveArea = 2000;
      dashboardResponse.areaByState = [];
      dashboardResponse.areaByCrop = [
        {
          crop: "Soja",
          totalArea: 4000,
          productiveArea: 3200,
          nonProductiveArea: 800,
        },
        {
          crop: "Milho",
          totalArea: 3000,
          productiveArea: 2400,
          nonProductiveArea: 600,
        },
        {
          crop: "Algodão",
          totalArea: 2000,
          productiveArea: 1600,
          nonProductiveArea: 400,
        },
        {
          crop: "Café",
          totalArea: 1000,
          productiveArea: 800,
          nonProductiveArea: 200,
        },
      ];

      expect(dashboardResponse.areaByCrop).toHaveLength(4);
      expect(dashboardResponse.areaByCrop[0].crop).toBe("Soja");
      expect(dashboardResponse.areaByCrop[1].crop).toBe("Milho");
      expect(dashboardResponse.areaByCrop[2].crop).toBe("Algodão");
      expect(dashboardResponse.areaByCrop[3].crop).toBe("Café");
    });

    it("should handle empty arrays for areaByState and areaByCrop", () => {
      const dashboardResponse = new DashboardResponseDTO();
      dashboardResponse.totalArea = 0;
      dashboardResponse.productiveArea = 0;
      dashboardResponse.nonProductiveArea = 0;
      dashboardResponse.areaByState = [];
      dashboardResponse.areaByCrop = [];

      expect(dashboardResponse.areaByState).toBeDefined();
      expect(dashboardResponse.areaByState).toEqual([]);
      expect(dashboardResponse.areaByState).toHaveLength(0);
      expect(dashboardResponse.areaByCrop).toBeDefined();
      expect(dashboardResponse.areaByCrop).toEqual([]);
      expect(dashboardResponse.areaByCrop).toHaveLength(0);
    });

    it("should correctly aggregate total areas", () => {
      const dashboardResponse = new DashboardResponseDTO();
      dashboardResponse.totalArea = 15000;
      dashboardResponse.productiveArea = 12000;
      dashboardResponse.nonProductiveArea = 3000;
      dashboardResponse.areaByState = [
        {
          state: "SP",
          totalArea: 5000,
          productiveArea: 4000,
          nonProductiveArea: 1000,
        },
        {
          state: "MG",
          totalArea: 5000,
          productiveArea: 4000,
          nonProductiveArea: 1000,
        },
        {
          state: "PR",
          totalArea: 5000,
          productiveArea: 4000,
          nonProductiveArea: 1000,
        },
      ];
      dashboardResponse.areaByCrop = [
        {
          crop: "Soja",
          totalArea: 7500,
          productiveArea: 6000,
          nonProductiveArea: 1500,
        },
        {
          crop: "Milho",
          totalArea: 7500,
          productiveArea: 6000,
          nonProductiveArea: 1500,
        },
      ];

      expect(dashboardResponse.totalArea).toBe(15000);
      expect(dashboardResponse.productiveArea).toBe(12000);
      expect(dashboardResponse.nonProductiveArea).toBe(3000);
      expect(
        dashboardResponse.productiveArea +
          dashboardResponse.nonProductiveArea,
      ).toBe(dashboardResponse.totalArea);
    });

    it("should verify that productive + non-productive equals total area", () => {
      const dashboardResponse = new DashboardResponseDTO();
      dashboardResponse.totalArea = 1000;
      dashboardResponse.productiveArea = 700;
      dashboardResponse.nonProductiveArea = 300;
      dashboardResponse.areaByState = [];
      dashboardResponse.areaByCrop = [];

      expect(
        dashboardResponse.productiveArea +
          dashboardResponse.nonProductiveArea,
      ).toBe(dashboardResponse.totalArea);
    });
  });
});
