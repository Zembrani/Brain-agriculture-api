import { Test, TestingModule } from "@nestjs/testing";
import { DashboardService } from "./dashboard.service";
import { Dashboard } from "../../../domain/dashboardDomain";

describe("DashboardService", () => {
  let service: DashboardService;

  const mockDashboardRepository = {
    getDashboard: jest.fn(),
  };

  const mockFarmData: Dashboard[] = [
    {
      id: "1",
      producer_id: "1",
      name: "Fazenda São João",
      city: "Campinas",
      state: "SP",
      totalArea: 1500,
      productiveArea: 1200,
      nonProductiveArea: 300,
      crops: [
        { id: "1", farm_id: "1", year: 2024, crop: "Soja" },
        { id: "2", farm_id: "1", year: 2024, crop: "Milho" },
      ],
    },
    {
      id: "2",
      producer_id: "1",
      name: "Fazenda Boa Vista",
      city: "Ribeirão Preto",
      state: "SP",
      totalArea: 2000,
      productiveArea: 1800,
      nonProductiveArea: 200,
      crops: [
        { id: "3", farm_id: "2", year: 2024, crop: "Soja" },
        { id: "4", farm_id: "2", year: 2024, crop: "Café" },
      ],
    },
    {
      id: "3",
      producer_id: "2",
      name: "Fazenda Esperança",
      city: "Uberaba",
      state: "MG",
      totalArea: 3000,
      productiveArea: 2500,
      nonProductiveArea: 500,
      crops: [{ id: "5", farm_id: "3", year: 2024, crop: "Milho" }],
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: "IDashboardRepository",
          useValue: mockDashboardRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getDashboard", () => {
    it("should calculate total areas correctly", async () => {
      mockDashboardRepository.getDashboard.mockResolvedValue(mockFarmData);

      const result = await service.getDashboard();

      expect(result.totalArea).toBe(6500); // 1500 + 2000 + 3000
      expect(result.productiveArea).toBe(5500); // 1200 + 1800 + 2500
      expect(result.nonProductiveArea).toBe(1000); // 300 + 200 + 500
    });

    it("should aggregate areas by state correctly", async () => {
      mockDashboardRepository.getDashboard.mockResolvedValue(mockFarmData);

      const result = await service.getDashboard();

      expect(result.areaByState).toHaveLength(2);

      const spData = result.areaByState.find((item) => item.state === "SP");
      expect(spData).toBeDefined();
      expect(spData?.totalArea).toBe(3500); // 1500 + 2000
      expect(spData?.productiveArea).toBe(3000); // 1200 + 1800
      expect(spData?.nonProductiveArea).toBe(500); // 300 + 200

      const mgData = result.areaByState.find((item) => item.state === "MG");
      expect(mgData).toBeDefined();
      expect(mgData?.totalArea).toBe(3000);
      expect(mgData?.productiveArea).toBe(2500);
      expect(mgData?.nonProductiveArea).toBe(500);
    });

    it("should aggregate areas by crop correctly", async () => {
      mockDashboardRepository.getDashboard.mockResolvedValue(mockFarmData);

      const result = await service.getDashboard();

      expect(result.areaByCrop.length).toBeGreaterThan(0);

      const sojaData = result.areaByCrop.find((item) => item.crop === "Soja");
      expect(sojaData).toBeDefined();
      expect(sojaData?.totalArea).toBe(3500); // 1500 + 2000 (farms with Soja)

      const milhoData = result.areaByCrop.find((item) => item.crop === "Milho");
      expect(milhoData).toBeDefined();
      expect(milhoData?.totalArea).toBe(4500); // 1500 + 3000 (farms with Milho)

      const cafeData = result.areaByCrop.find((item) => item.crop === "Café");
      expect(cafeData).toBeDefined();
      expect(cafeData?.totalArea).toBe(2000); // Only farm 2
    });

    it("should return empty data when no farms exist", async () => {
      mockDashboardRepository.getDashboard.mockResolvedValue([]);

      const result = await service.getDashboard();

      expect(result.totalArea).toBe(0);
      expect(result.productiveArea).toBe(0);
      expect(result.nonProductiveArea).toBe(0);
      expect(result.areaByState).toEqual([]);
      expect(result.areaByCrop).toEqual([]);
    });

    it("should handle farms with no crops", async () => {
      const farmWithNoCrops: Dashboard[] = [
        {
          id: "1",
          producer_id: "1",
          name: "Fazenda Vazia",
          city: "São Paulo",
          state: "SP",
          totalArea: 1000,
          productiveArea: 800,
          nonProductiveArea: 200,
          crops: [],
        },
      ];

      mockDashboardRepository.getDashboard.mockResolvedValue(farmWithNoCrops);

      const result = await service.getDashboard();

      expect(result.totalArea).toBe(1000);
      expect(result.areaByCrop).toEqual([]);
      expect(result.areaByState).toHaveLength(1);
    });

    it("should handle multiple farms in the same state", async () => {
      const samStateFarms: Dashboard[] = [
        {
          id: "1",
          producer_id: "1",
          name: "Fazenda 1",
          city: "Campinas",
          state: "SP",
          totalArea: 1000,
          productiveArea: 800,
          nonProductiveArea: 200,
          crops: [],
        },
        {
          id: "2",
          producer_id: "1",
          name: "Fazenda 2",
          city: "São Paulo",
          state: "SP",
          totalArea: 2000,
          productiveArea: 1500,
          nonProductiveArea: 500,
          crops: [],
        },
      ];

      mockDashboardRepository.getDashboard.mockResolvedValue(samStateFarms);

      const result = await service.getDashboard();

      expect(result.areaByState).toHaveLength(1);
      const spData = result.areaByState[0];
      expect(spData.state).toBe("SP");
      expect(spData.totalArea).toBe(3000);
      expect(spData.productiveArea).toBe(2300);
      expect(spData.nonProductiveArea).toBe(700);
    });

    it("should handle repository errors", async () => {
      mockDashboardRepository.getDashboard.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(service.getDashboard()).rejects.toThrow("Database error");
    });

    it("should call repository getDashboard method", async () => {
      mockDashboardRepository.getDashboard.mockResolvedValue(mockFarmData);

      await service.getDashboard();

      expect(mockDashboardRepository.getDashboard).toHaveBeenCalledTimes(1);
    });
  });
});
