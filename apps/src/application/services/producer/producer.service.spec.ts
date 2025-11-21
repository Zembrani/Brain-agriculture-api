import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProducerDTO, UpdateProducerDTO } from '../../../domain/producerDomain';

describe('ProducerService', () => {
  let service: ProducerService;

  const mockProducerRepository = {
    getAll: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const genericProducer = {
    id: '1',
    cpfCnpj: '12345678901',
    name: 'John Doe',
    phone: '+1234567890',
    personType: 'FISICA',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProducerService, {provide: 'IProducerRepository', useValue: mockProducerRepository }],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should call producerRepository.getAll and return its result', async () => {
      mockProducerRepository.getAll.mockResolvedValue([genericProducer]);

      const result = await service.getAll();

      expect(mockProducerRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual([genericProducer]);
    });

    it('should return an empty array when no producers exist', async () => {
      mockProducerRepository.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(mockProducerRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should call producerRepository.create and return the created producer', async () => {
      const createDto: CreateProducerDTO = {
        cpfCnpj: '12345678901',
        name: 'John Doe',
        phone: '+1234567890',
        personType: 'FISICA',
      };
      mockProducerRepository.create.mockResolvedValue(genericProducer);

      const result = await service.create(createDto);

      expect(mockProducerRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(genericProducer);
    });
  });

  describe('update', () => {
    it('should call producerRepository.update and return the updated producer', async () => {
      const updateDto: UpdateProducerDTO = {
        cpfCnpj: '98765432109',
        name: 'Jane Doe',
        phone: '+0987654321',
        personType: 'FISICA',
      };
      const updatedProducer = { ...genericProducer, ...updateDto };
      mockProducerRepository.getById.mockResolvedValue(genericProducer);
      mockProducerRepository.update.mockResolvedValue(updatedProducer);

      const result = await service.update('1', updateDto);

      expect(mockProducerRepository.getById).toHaveBeenCalledWith('1');
      expect(mockProducerRepository.update).toHaveBeenCalledWith({
        ...genericProducer,
        ...updateDto,
      });
      expect(result).toEqual(updatedProducer);
    });

    it('should throw NotFoundException when producer does not exist', async () => {
      const updateDto: UpdateProducerDTO = {
        cpfCnpj: '98765432109',
        name: 'Jane Doe',
        phone: '+0987654321',
        personType: 'FISICA',
      };
      mockProducerRepository.getById.mockResolvedValue(null);

      await expect(service.update('999', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update('999', updateDto)).rejects.toThrow(
        'Producer not found.',
      );
      expect(mockProducerRepository.getById).toHaveBeenCalledWith('999');
      expect(mockProducerRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should call producerRepository.delete when producer exists', async () => {
      mockProducerRepository.getById.mockResolvedValue(genericProducer);
      mockProducerRepository.delete.mockResolvedValue(undefined);

      await service.delete('1');

      expect(mockProducerRepository.getById).toHaveBeenCalledWith('1');
      expect(mockProducerRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when producer does not exist', async () => {
      mockProducerRepository.getById.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
      await expect(service.delete('999')).rejects.toThrow('Producer not found.');
      expect(mockProducerRepository.getById).toHaveBeenCalledWith('999');
      expect(mockProducerRepository.delete).not.toHaveBeenCalled();
    });
  });
});
