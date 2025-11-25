import { Test, TestingModule } from "@nestjs/testing";
import { CropRepository } from "./cropRepository";
import { Repository } from "typeorm";
import { CropEntity } from "../entities/cropEntity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateCropDTO } from "../../domain/cropDomain";

describe("CropRepository", () => {
  let repository: CropRepository;
  let mockRepository: jest.Mocked<Repository<CropEntity>>;

  const mockCrop = {
    id: "1",
    farm_id: "1",
    year: 2023,
    crop: "Corn",
  };

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropRepository,
        {
          provide: getRepositoryToken(CropEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<CropRepository>(CropRepository);
    mockRepository = module.get(getRepositoryToken(CropEntity));
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("getAll", () => {
    it("should return all crops", async () => {
      mockRepository.find.mockResolvedValue([mockCrop] as any);

      const result = await repository.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockCrop]);
    });

    it("should return empty array when no crops exist", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create and return a crop", async () => {
      const createDto: CreateCropDTO = {
        farm_id: "1",
        year: 2023,
        crop: "Corn",
      };
      mockRepository.save.mockResolvedValue(mockCrop as any);

      const result = await repository.create(createDto);

      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCrop);
    });
  });
});
