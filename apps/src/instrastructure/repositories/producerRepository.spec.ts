import { Test, TestingModule } from '@nestjs/testing';
import { ProducerRepository } from './producerRespository';
import { Repository } from 'typeorm';
import { ProducerEntity } from '../entities/producerEntity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProducerDTO, UpdateProducerDTO } from '../../domain/producerDomain';

describe('ProducerRepository', () => {
  let repository: ProducerRepository;
  let mockRepository: jest.Mocked<Repository<ProducerEntity>>;

  const mockProducer = {
    id: '1',
    cpfCnpj: '12345678901',
    name: 'John Doe',
    phone: '+1234567890',
    personType: 'FISICA',
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
        ProducerRepository,
        {
          provide: getRepositoryToken(ProducerEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<ProducerRepository>(ProducerRepository);
    mockRepository = module.get(getRepositoryToken(ProducerEntity));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all producers', async () => {
      mockRepository.find.mockResolvedValue([mockProducer] as any);

      const result = await repository.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockProducer]);
    });

    it('should return empty array when no producers exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a producer by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducer as any);

      const result = await repository.getById('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockProducer);
    });

    it('should return undefined when producer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.getById('999');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and return a producer', async () => {
      const createDto: CreateProducerDTO = {
        cpfCnpj: '12345678901',
        name: 'John Doe',
        phone: '+1234567890',
        personType: 'FISICA',
      };
      mockRepository.save.mockResolvedValue(mockProducer as any);

      const result = await repository.create(createDto);

      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockProducer);
    });
  });

  describe('update', () => {
    it('should update and return a producer', async () => {
      const updateDto: UpdateProducerDTO = {
        cpfCnpj: '98765432109',
        name: 'Jane Doe',
        phone: '+0987654321',
        personType: 'FISICA',
      };
      const updatedProducer = { ...mockProducer, ...updateDto };
      mockRepository.save.mockResolvedValue(updatedProducer as any);

      const result = await repository.update(updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith(updateDto);
      expect(result).toEqual(updatedProducer);
    });
  });

  describe('delete', () => {
    it('should delete a producer by id', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
