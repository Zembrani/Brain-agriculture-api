import 'reflect-metadata';
import express from 'express';
import * as dotenv from 'dotenv';
import { DatabaseConnection } from './config/database';
import { Producer } from './entities/Producer';
import { ProducerFarm } from './entities/ProducerFarm';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  const dbConnection = DatabaseConnection.getInstance();
  res.json({
    status: 'ok',
    database: dbConnection.isConnected() ? 'connected' : 'disconnected',
  });
});

// Get all producers
app.get('/producers', async (req, res) => {
  try {
    const dataSource = DatabaseConnection.getInstance().getDataSource();
    const producerRepository = dataSource.getRepository(Producer);
    const producers = await producerRepository.find({ relations: ['farms'] });
    res.json(producers);
  } catch (error) {
    console.error('Error fetching producers:', error);
    res.status(500).json({ error: 'Failed to fetch producers' });
  }
});

// Get a single producer by ID
app.get('/producers/:id', async (req, res) => {
  try {
    const dataSource = DatabaseConnection.getInstance().getDataSource();
    const producerRepository = dataSource.getRepository(Producer);
    const producer = await producerRepository.findOne({
      where: { id: req.params.id },
      relations: ['farms'],
    });
    
    if (!producer) {
      return res.status(404).json({ error: 'Producer not found' });
    }
    
    res.json(producer);
  } catch (error) {
    console.error('Error fetching producer:', error);
    res.status(500).json({ error: 'Failed to fetch producer' });
  }
});

// Create a new producer
app.post('/producers', async (req, res) => {
  try {
    const dataSource = DatabaseConnection.getInstance().getDataSource();
    const producerRepository = dataSource.getRepository(Producer);
    const producer = producerRepository.create(req.body);
    const savedProducer = await producerRepository.save(producer);
    res.status(201).json(savedProducer);
  } catch (error) {
    console.error('Error creating producer:', error);
    res.status(500).json({ error: 'Failed to create producer' });
  }
});

// Delete a producer (will cascade delete farms)
app.delete('/producers/:id', async (req, res) => {
  try {
    const dataSource = DatabaseConnection.getInstance().getDataSource();
    const producerRepository = dataSource.getRepository(Producer);
    const result = await producerRepository.delete(req.params.id);
    
    if (result.affected === 0) {
      return res.status(404).json({ error: 'Producer not found' });
    }
    
    res.json({ message: 'Producer and associated farms deleted successfully' });
  } catch (error) {
    console.error('Error deleting producer:', error);
    res.status(500).json({ error: 'Failed to delete producer' });
  }
});

// Get all farms
app.get('/farms', async (req, res) => {
  try {
    const dataSource = DatabaseConnection.getInstance().getDataSource();
    const farmRepository = dataSource.getRepository(ProducerFarm);
    const farms = await farmRepository.find({ relations: ['producer'] });
    res.json(farms);
  } catch (error) {
    console.error('Error fetching farms:', error);
    res.status(500).json({ error: 'Failed to fetch farms' });
  }
});

// Create a new farm
app.post('/farms', async (req, res) => {
  try {
    const dataSource = DatabaseConnection.getInstance().getDataSource();
    const farmRepository = dataSource.getRepository(ProducerFarm);
    const farm = farmRepository.create(req.body);
    const savedFarm = await farmRepository.save(farm);
    res.status(201).json(savedFarm);
  } catch (error) {
    console.error('Error creating farm:', error);
    res.status(500).json({ error: 'Failed to create farm' });
  }
});

// Start server
async function startServer() {
  try {
    // Initialize database connection
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.disconnect();
  process.exit(0);
});

startServer();
