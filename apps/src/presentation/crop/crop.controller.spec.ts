import { Test, TestingModule } from "@nestjs/testing";
import { CropController } from "./crop.controller";
import { CreateCropDTO } from "apps/src/domain/cropDomain";

const mockCropService = {
  getAll: jest.fn(),
  create: jest.fn(),
};

const genericCrop = { id: "1", farm_id: "1", year: 2025, crop: "Wheat" };

describe("CropController", () => {
  let controller: CropController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropController],
      providers: [
        {
          provide: "ICropService",
          useValue: mockCropService,
        },
      ],
    }).compile();

    controller = module.get<CropController>(CropController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAll", () => {
    it("should call cropService.getAll and return its result", async () => {
      mockCropService.getAll.mockResolvedValue(genericCrop);

      const result = await controller.getAll();

      expect(mockCropService.getAll).toHaveBeenCalled();
      expect(result).toBe(genericCrop);
    });
  });

  describe("create", () => {
    it("should call cropService.create and return its result", async () => {
      mockCropService.create.mockResolvedValue(genericCrop);

      const result = await controller.create(genericCrop as CreateCropDTO);

      expect(mockCropService.create).toHaveBeenCalled();
      expect(result).toBe(genericCrop);
    });
  });
});
