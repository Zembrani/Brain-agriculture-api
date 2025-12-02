import { Test, TestingModule } from "@nestjs/testing";
import { DashboardRepository } from "./dashboardRepository";
import { DataSource } from "typeorm";

describe("DashboardRepository", () => {
  let repository: DashboardRepository;
  let mockDataSource: jest.Mocked<DataSource>;

  const mockQueryResult = [
    {
      id: "1",
      state: "SP",
      totalarea: "1500.00",
      productivearea: "1200.00",
      nonproductivearea: "300.00",
      crops: [
        { id: "1", year: 2024, crop: "Soja" },
        { id: "2", year: 2024, crop: "Milho" },
      ],
    },
    {
      id: "2",
      state: "MG",
      totalarea: "2000.00",
      productivearea: "1800.00",
      nonproductivearea: "200.00",
      crops: [{ id: "3", year: 2024, crop: "Café" }],
    },
  ];

  beforeEach(async () => {
    mockDataSource = {
      query: jest.fn(),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = module.get<DashboardRepository>(DashboardRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("getDashboard", () => {
    it("should return farm data with crops aggregated", async () => {
      mockDataSource.query.mockResolvedValue(mockQueryResult);

      const result = await repository.getDashboard();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[0].state).toBe("SP");
      expect(result[0].crops).toHaveLength(2);
      expect(result[1].crops).toHaveLength(1);
    });

    it("should execute SQL query with correct structure", async () => {
      mockDataSource.query.mockResolvedValue(mockQueryResult);

      await repository.getDashboard();

      expect(mockDataSource.query).toHaveBeenCalledTimes(1);
      const query = mockDataSource.query.mock.calls[0][0];

      expect(query).toContain("SELECT");
      expect(query).toContain("FROM farm f");
      expect(query).toContain("LEFT JOIN crop c");
      expect(query).toContain("GROUP BY f.id");
      expect(query).toContain("ORDER BY f.id");
    });

    it("should return farms without crops when no crops exist", async () => {
      const farmsWithoutCrops = [
        {
          id: "1",
          state: "SP",
          totalarea: "1500.00",
          productivearea: "1200.00",
          nonproductivearea: "300.00",
          crops: [],
        },
      ];

      mockDataSource.query.mockResolvedValue(farmsWithoutCrops);

      const result = await repository.getDashboard();

      expect(result).toHaveLength(1);
      expect(result[0].crops).toEqual([]);
    });

    it("should return empty array when no farms exist", async () => {
      mockDataSource.query.mockResolvedValue([]);

      const result = await repository.getDashboard();

      expect(result).toEqual([]);
      expect(mockDataSource.query).toHaveBeenCalledTimes(1);
    });

    it("should handle database errors", async () => {
      mockDataSource.query.mockRejectedValue(new Error("Connection timeout"));

      await expect(repository.getDashboard()).rejects.toThrow(
        "Connection timeout",
      );
    });

    it("should handle multiple crops per farm", async () => {
      const farmWithManyCrops = [
        {
          id: "1",
          state: "SP",
          totalarea: "5000.00",
          productivearea: "4500.00",
          nonproductivearea: "500.00",
          crops: [
            { id: "1", year: 2024, crop: "Soja" },
            { id: "2", year: 2024, crop: "Milho" },
            { id: "3", year: 2024, crop: "Café" },
            { id: "4", year: 2024, crop: "Algodão" },
          ],
        },
      ];

      mockDataSource.query.mockResolvedValue(farmWithManyCrops);

      const result = await repository.getDashboard();

      expect(result[0].crops).toHaveLength(4);
      expect(result[0].crops.map((c) => c.crop)).toEqual([
        "Soja",
        "Milho",
        "Café",
        "Algodão",
      ]);
    });

    it("should preserve numeric precision for area values", async () => {
      const preciseData = [
        {
          id: "1",
          state: "SP",
          totalarea: "1234.56",
          productivearea: "987.65",
          nonproductivearea: "246.91",
          crops: [],
        },
      ];

      mockDataSource.query.mockResolvedValue(preciseData);

      const result = await repository.getDashboard();

      // Should convert to numbers with precision preserved
      expect(result[0].totalArea).toBe(1234.56);
      expect(result[0].productiveArea).toBe(987.65);
      expect(result[0].nonProductiveArea).toBe(246.91);
    });

    it("should handle null crop data correctly", async () => {
      const farmWithNullCrop = [
        {
          id: "1",
          state: "SP",
          totalarea: "1500.00",
          productivearea: "1200.00",
          nonproductivearea: "300.00",
          crops: null,
        },
      ];

      mockDataSource.query.mockResolvedValue(farmWithNullCrop);

      const result = await repository.getDashboard();

      expect(result[0].crops).toBeNull();
    });
  });
});
