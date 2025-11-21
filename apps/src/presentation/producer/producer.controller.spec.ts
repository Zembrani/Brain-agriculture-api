import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import {
  CreateProducerDTO,
  ParamProducerDTO,
} from 'apps/src/domain/producerDomain';

const mockProducerService = {
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const genericProducer = {
  cpfCnpj: '66.995.915/0001-92',
  name: 'João da Silva',
  phone: '91234-6548',
  personType: 'JURIDICA',
};
const genericParam: ParamProducerDTO = { id: '1' };

describe('ProducerController', () => {
  let controller: ProducerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: 'IProducerService',
          useValue: mockProducerService,
        },
      ],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should call producerService.getAll and return its result', async () => {
      mockProducerService.getAll.mockResolvedValue(genericProducer);

      const result = await controller.getAll();

      expect(mockProducerService.getAll).toHaveBeenCalled();
      expect(result).toBe(genericProducer);
    });
  });

  describe('create', () => {
    it('should call producerService.create and return its result', async () => {
      mockProducerService.create.mockResolvedValue(genericProducer);

      const result = await controller.create(genericProducer);

      expect(mockProducerService.create).toHaveBeenCalled();
      expect(result).toBe(genericProducer);
    });
  });

  describe('update', () => {
    it('should call producerService.update and return its result', async () => {
      mockProducerService.update.mockResolvedValue(genericProducer);

      const result = await controller.update(genericParam, genericProducer);

      expect(mockProducerService.update).toHaveBeenCalled();
      expect(result).toBe(genericProducer);
    });
  });

  describe('delete', () => {
    it('should call producerService.delete and return a success message', async () => {
      mockProducerService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(genericParam);

      expect(mockProducerService.delete).toHaveBeenCalled();
      expect(result).toBe(`Producer id: ${genericParam.id} deleted succesfully.`);
    });
  });
});
