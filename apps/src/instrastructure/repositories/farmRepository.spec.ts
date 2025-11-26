import { Test, TestingModule } from "@nestjs/testing";
import { FarmRepository } from "./farmRepository";
import { Repository } from "typeorm";
import { FarmEntity } from "../entities/farmEntity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateFarmDTO, Farm, UpdateFarmDTO } from "../../domain/farmDomain";

describe("FarmRepository", () => {
  let repository: FarmRepository;
  let mockRepository: jest.Mocked<Repository<FarmEntity>>;

  const mockFarm = {
    id: "1",
    producer_id: "1",
    name: "Fazenda São João",
    city: "São Paulo",
    state: "SP",
    totalArea: 1000,
    productiveArea: 700,
    nonProductiveArea: 300,
  };

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmRepository,
        {
          provide: getRepositoryToken(FarmEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<FarmRepository>(FarmRepository);
    mockRepository = module.get(getRepositoryToken(FarmEntity));
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("getAll", () => {
    it("should return all farms", async () => {
      mockRepository.find.mockResolvedValue([mockFarm] as Farm[]);

      const result = await repository.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockFarm]);
    });

    it("should return empty array when no farms exist", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return a farm by id", async () => {
      mockRepository.findOne.mockResolvedValue(mockFarm as Farm);

      const result = await repository.getById("1");

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(result).toEqual(mockFarm);
    });

    it("should return undefined when farm not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.getById("999");

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: "999" },
      });
      expect(result).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should create and return a farm", async () => {
      const createDto: CreateFarmDTO = {
        producer_id: "1",
        name: "Fazenda São João",
        city: "São Paulo",
        state: "SP",
        totalArea: 1000,
        productiveArea: 700,
        nonProductiveArea: 300,
      };
      mockRepository.save.mockResolvedValue(mockFarm as Farm);

      const result = await repository.create(createDto);

      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockFarm);
    });
  });

  describe("update", () => {
    it("should update and return a farm", async () => {
      const updateDto: UpdateFarmDTO = {
        name: "Fazenda São João Atualizada",
        totalArea: 1200,
        productiveArea: 800,
        nonProductiveArea: 400,
      };
      const updatedFarm = { ...mockFarm, ...updateDto };
      mockRepository.save.mockResolvedValue(updatedFarm as Farm);

      const result = await repository.update(updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith(updateDto);
      expect(result).toEqual(updatedFarm);
    });
  });

  describe("delete", () => {
    it("should delete a farm by id", async () => {
      await repository.delete("1");

      expect(mockRepository.delete).toHaveBeenCalled();
    });
  });

  describe("getFarmsByProducerId", () => {
    it("should return farms for a given producer id", async () => {
      mockRepository.find.mockResolvedValue([mockFarm] as Farm[]);

      const result = await repository.getFarmsByProducerId("1");

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { producer_id: "1" },
      });
      expect(result).toEqual([mockFarm]);
    });

    it("should return empty array when no farms found for producer", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.getFarmsByProducerId("999");

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { producer_id: "999" },
      });
      expect(result).toEqual([]);
    });
  });
});
