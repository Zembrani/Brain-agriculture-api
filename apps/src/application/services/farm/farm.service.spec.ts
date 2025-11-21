import { Test, TestingModule } from "@nestjs/testing";
import { FarmService } from "./farm.service";
import { NotFoundException } from "@nestjs/common";
import { CreateFarmDTO, UpdateFarmDTO } from "../../../domain/farmDomain";

describe("FarmService", () => {
  let service: FarmService;

  const mockFarmRepository = {
    getAll: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FarmService, {provide: 'IFarmRepository', useValue: mockFarmRepository }],
    }).compile();

    service = module.get<FarmService>(FarmService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    it("should call farmRepository.getAll and return its result", async () => {
      mockFarmRepository.getAll.mockResolvedValue([genericFarm]);

      const result = await service.getAll();

      expect(mockFarmRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual([genericFarm]);
    });

    it("should return an empty array when no farms exist", async () => {
      mockFarmRepository.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(mockFarmRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("should call farmRepository.create and return the created farm", async () => {
      const createDto: CreateFarmDTO = {
        producer_id: "1",
        city: "São Paulo",
        state: "SP",
        totalArea: 1000,
        productiveArea: 700,
        nonProductiveArea: 300,
      };
      mockFarmRepository.create.mockResolvedValue(genericFarm);

      const result = await service.create(createDto);

      expect(mockFarmRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(genericFarm);
    });
  });

  describe("update", () => {
    it("should call farmRepository.update and return the updated farm", async () => {
      const updateDto: UpdateFarmDTO = {
        totalArea: 1200,
        productiveArea: 800,
        nonProductiveArea: 400,
      };
      const updatedFarm = { ...genericFarm, ...updateDto };
      mockFarmRepository.getById.mockResolvedValue(genericFarm);
      mockFarmRepository.update.mockResolvedValue(updatedFarm);

      const result = await service.update("1", updateDto);

      expect(mockFarmRepository.getById).toHaveBeenCalledWith("1");
      expect(mockFarmRepository.update).toHaveBeenCalledWith({
        ...genericFarm,
        ...updateDto,
      });
      expect(result).toEqual(updatedFarm);
    });

    it("should throw NotFoundException when farm does not exist", async () => {
      const updateDto: UpdateFarmDTO = {
        totalArea: 1200,
        productiveArea: 800,
        nonProductiveArea: 400,
      };
      mockFarmRepository.getById.mockResolvedValue(null);

      await expect(service.update("999", updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update("999", updateDto)).rejects.toThrow(
        "Farm not found.",
      );
      expect(mockFarmRepository.getById).toHaveBeenCalledWith("999");
      expect(mockFarmRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should call farmRepository.delete when farm exists", async () => {
      mockFarmRepository.getById.mockResolvedValue(genericFarm);
      mockFarmRepository.delete.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockFarmRepository.getById).toHaveBeenCalledWith("1");
      expect(mockFarmRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException when farm does not exist", async () => {
      mockFarmRepository.getById.mockResolvedValue(null);

      await expect(service.delete("999")).rejects.toThrow(NotFoundException);
      await expect(service.delete("999")).rejects.toThrow("Farm not found.");
      expect(mockFarmRepository.getById).toHaveBeenCalledWith("999");
      expect(mockFarmRepository.delete).not.toHaveBeenCalled();
    });
  });
});
