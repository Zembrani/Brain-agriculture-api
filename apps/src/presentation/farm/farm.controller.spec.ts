import { Test, TestingModule } from "@nestjs/testing";
import { FarmController } from "./farm.controller";
import {
  CreateFarmDTO,
  FarmParamDTO,
  UpdateFarmDTO,
} from "apps/src/domain/farmDomain";

const mockFarmService = {
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const genericFarm = {
  id: "1",
  producer_id: "1",
  city: "São Paulo",
  state: "SP",
  totalArea: 1000,
  productiveArea: 700,
  nonProductiveArea: 300,
};
const genericParam: FarmParamDTO = { id: "1" };

describe("FarmController", () => {
  let controller: FarmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: "IFarmService",
          useValue: mockFarmService,
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAll", () => {
    it("should call farmService.getAll and return its result", async () => {
      mockFarmService.getAll.mockResolvedValue([genericFarm]);

      const result = await controller.getAll();

      expect(mockFarmService.getAll).toHaveBeenCalled();
      expect(result).toEqual([genericFarm]);
    });
  });

  describe("create", () => {
    it("should call farmService.create and return its result", async () => {
      const createDto: CreateFarmDTO = {
        producer_id: "1",
        city: "São Paulo",
        state: "SP",
        totalArea: 1000,
        productiveArea: 700,
        nonProductiveArea: 300,
      };
      mockFarmService.create.mockResolvedValue(genericFarm);

      const result = await controller.create(createDto);

      expect(mockFarmService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(genericFarm);
    });
  });

  describe("update", () => {
    it("should call farmService.update and return its result", async () => {
      const updateDto: UpdateFarmDTO = {
        totalArea: 1200,
        productiveArea: 800,
        nonProductiveArea: 400,
      };
      const updatedFarm = { ...genericFarm, ...updateDto };
      mockFarmService.update.mockResolvedValue(updatedFarm);

      const result = await controller.update(genericParam, updateDto);

      expect(mockFarmService.update).toHaveBeenCalledWith(genericParam.id, updateDto);
      expect(result).toEqual(updatedFarm);
    });
  });

  describe("delete", () => {
    it("should call farmService.delete and return a success message", async () => {
      mockFarmService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(genericParam);

      expect(mockFarmService.delete).toHaveBeenCalledWith(genericParam.id);
      expect(result).toBe(`Farm id: ${genericParam.id} deleted succesfully.`);
    });
  });
});
