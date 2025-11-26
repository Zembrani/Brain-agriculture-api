import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardResponseDTO } from '../../domain/dashboardDomain';

describe('DashboardController', () => {
  let controller: DashboardController;
  const mockDashboardService = {
    getDashboard: jest.fn(),
  };

  const mockDashboardResponse: DashboardResponseDTO = {
    totalArea: 5000,
    productiveArea: 4000,
    nonProductiveArea: 1000,
    areaByState: [
      {
        state: 'SP',
        totalArea: 3000,
        productiveArea: 2500,
        nonProductiveArea: 500,
      },
      {
        state: 'MG',
        totalArea: 2000,
        productiveArea: 1500,
        nonProductiveArea: 500,
      },
    ],
    areaByCrop: [
      {
        crop: 'Soja',
        totalArea: 2000,
        productiveArea: 1800,
        nonProductiveArea: 200,
      },
      {
        crop: 'Milho',
        totalArea: 3000,
        productiveArea: 2200,
        nonProductiveArea: 800,
      },
    ],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: 'IDashboardService',
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboardData', () => {
    it('should return dashboard data with totals and aggregations', async () => {
      mockDashboardService.getDashboard.mockResolvedValue(mockDashboardResponse);

      const result = await controller.getDashboardData();

      expect(mockDashboardService.getDashboard).toHaveBeenCalled();
      expect(result).toEqual(mockDashboardResponse);
      expect(result.totalArea).toBe(5000);
      expect(result.areaByState).toHaveLength(2);
      expect(result.areaByCrop).toHaveLength(2);
    });

    it('should return empty data when no farms exist', async () => {
      const emptyResponse: DashboardResponseDTO = {
        totalArea: 0,
        productiveArea: 0,
        nonProductiveArea: 0,
        areaByState: [],
        areaByCrop: [],
      };

      mockDashboardService.getDashboard.mockResolvedValue(emptyResponse);

      const result = await controller.getDashboardData();

      expect(result.totalArea).toBe(0);
      expect(result.areaByState).toEqual([]);
      expect(result.areaByCrop).toEqual([]);
    });

    it('should handle service errors properly', async () => {
      mockDashboardService.getDashboard.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.getDashboardData()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
