import { Test, TestingModule } from "@nestjs/testing";
import { CropService } from "./crop.service";
import { CreateCropDTO } from "../../../domain/cropDomain";

describe("CropService", () => {
  let service: CropService;

  const mockCropRepository = {
    getAll: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const genericCrop = {
    id: "1",
    farm_id: "1",
    year: 2023,
    crop: "Corn",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        { provide: "ICropRepository", useValue: mockCropRepository },
      ],
    }).compile();

    service = module.get<CropService>(CropService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    it("should call cropRepository.getAll and return its result", async () => {
      mockCropRepository.getAll.mockResolvedValue([genericCrop]);

      const result = await service.getAll();

      expect(mockCropRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual([genericCrop]);
    });

    it("should return an empty array when no crops exist", async () => {
      mockCropRepository.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(mockCropRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("should call cropRepository.create and return the created crop", async () => {
      const createDto: CreateCropDTO = {
        farm_id: "1",
        year: 2023,
        crop: "Corn",
      };
      mockCropRepository.create.mockResolvedValue(genericCrop);

      const result = await service.create(createDto);

      expect(mockCropRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(genericCrop);
    });

    it("should create a crop with different crop type", async () => {
      const createDto: CreateCropDTO = {
        farm_id: "2",
        year: 2024,
        crop: "Soybean",
      };
      const soybeanCrop = {
        id: "2",
        farm_id: "2",
        year: 2024,
        crop: "Soybean",
      };
      mockCropRepository.create.mockResolvedValue(soybeanCrop);

      const result = await service.create(createDto);

      expect(mockCropRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(soybeanCrop);
    });
  });
});
