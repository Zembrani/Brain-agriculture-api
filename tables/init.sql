CREATE TYPE personType AS ENUM ('FISICA', 'JURIDICA');

-- Producer table
CREATE TABLE IF NOT EXISTS producer (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    cpfCnpj TEXT NOT NULL,
    personType personType NOT NULL
);

-- Farm table
CREATE TABLE IF NOT EXISTS farm (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    producer_id BIGINT NOT NULL REFERENCES producer(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    totalArea DECIMAL(10,2) NOT NULL,
    productiveArea DECIMAL(10,2) NOT NULL,
    nonProductiveArea DECIMAL(10,2) NOT NULL
);

-- Crop table
CREATE TABLE IF NOT EXISTS crop (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    farm_id BIGINT NOT NULL REFERENCES farm(id) ON DELETE CASCADE,
    year DECIMAL(4,0) NOT NULL,
    crops TEXT NOT NULL
);

-- Insert sample producers
INSERT INTO producer (name, phone, cpfCnpj, personType) VALUES
('João Silva', '(11) 98765-4321', '470.332.457-18', 'FISICA'),
('Fazendas Reunidas Ltda', '(19) 3456-7890', '66.995.915/0001-92', 'JURIDICA'),
('Maria Santos', '(27) 99123-4567', '123.456.789-09', 'FISICA'),
('AgroTech S.A.', '(61) 3321-9876', '11.222.333/0001-81', 'JURIDICA'),
('Pedro Oliveira', '(85) 98888-7777', '987.654.321-00', 'FISICA');

-- Insert sample farms
-- Producer 1 (João Silva) - 2 farms
INSERT INTO farm (producer_id, name, city, state, totalArea, productiveArea, nonProductiveArea) VALUES
((SELECT id FROM producer WHERE name = 'João Silva'), 'Fazenda Santa Rita', 'Campinas', 'SP', 1500.00, 1200.00, 300.00),
((SELECT id FROM producer WHERE name = 'João Silva'), 'Sítio Boa Vista', 'Jundiaí', 'SP', 800.00, 600.00, 200.00);

-- Producer 2 (Fazendas Reunidas Ltda) - 3 farms
INSERT INTO farm (producer_id, name, city, state, totalArea, productiveArea, nonProductiveArea) VALUES
((SELECT id FROM producer WHERE name = 'Fazendas Reunidas Ltda'), 'Fazenda São João', 'Ribeirão Preto', 'SP', 5000.00, 4500.00, 500.00),
((SELECT id FROM producer WHERE name = 'Fazendas Reunidas Ltda'), 'Fazenda Esperança', 'Uberaba', 'MG', 3500.00, 3000.00, 500.00),
((SELECT id FROM producer WHERE name = 'Fazendas Reunidas Ltda'), 'Estância Grande', 'Goiânia', 'GO', 4200.00, 3800.00, 400.00);

-- Producer 3 (Maria Santos) - 1 farm
INSERT INTO farm (producer_id, name, city, state, totalArea, productiveArea, nonProductiveArea) VALUES
((SELECT id FROM producer WHERE name = 'Maria Santos'), 'Chácara Recanto Verde', 'Vitória', 'ES', 500.00, 350.00, 150.00);

-- Producer 4 (AgroTech S.A.) - 0 farms (no insert)

-- Producer 5 (Pedro Oliveira) - 1 farm
INSERT INTO farm (producer_id, name, city, state, totalArea, productiveArea, nonProductiveArea) VALUES
((SELECT id FROM producer WHERE name = 'Pedro Oliveira'), 'Fazenda Nordeste', 'Fortaleza', 'CE', 2000.00, 1500.00, 500.00);

-- Insert sample crops
-- Farm 1 (Fazenda Santa Rita) - 3 crops
INSERT INTO crop (farm_id, year, crops) VALUES
((SELECT id FROM farm WHERE name = 'Fazenda Santa Rita'), 2024, 'Soja'),
((SELECT id FROM farm WHERE name = 'Fazenda Santa Rita'), 2024, 'Milho'),
((SELECT id FROM farm WHERE name = 'Fazenda Santa Rita'), 2025, 'Café');

-- Farm 2 (Sítio Boa Vista) - 2 crops
INSERT INTO crop (farm_id, year, crops) VALUES
((SELECT id FROM farm WHERE name = 'Sítio Boa Vista'), 2024, 'Cana de Açúcar'),
((SELECT id FROM farm WHERE name = 'Sítio Boa Vista'), 2025, 'Algodão');

-- Farm 3 (Fazenda São João) - 4 crops
INSERT INTO crop (farm_id, year, crops) VALUES
((SELECT id FROM farm WHERE name = 'Fazenda São João'), 2024, 'Soja'),
((SELECT id FROM farm WHERE name = 'Fazenda São João'), 2024, 'Milho'),
((SELECT id FROM farm WHERE name = 'Fazenda São João'), 2025, 'Trigo'),
((SELECT id FROM farm WHERE name = 'Fazenda São João'), 2025, 'Café');

-- Farm 4 (Fazenda Esperança) - 0 crops (no insert)

-- Farm 5 (Estância Grande) - 2 crops
INSERT INTO crop (farm_id, year, crops) VALUES
((SELECT id FROM farm WHERE name = 'Estância Grande'), 2024, 'Algodão'),
((SELECT id FROM farm WHERE name = 'Estância Grande'), 2025, 'Soja');

-- Farm 6 (Chácara Recanto Verde) - 1 crop
INSERT INTO crop (farm_id, year, crops) VALUES
((SELECT id FROM farm WHERE name = 'Chácara Recanto Verde'), 2024, 'Café');

-- Farm 7 (Fazenda Nordeste) - 3 crops
INSERT INTO crop (farm_id, year, crops) VALUES
((SELECT id FROM farm WHERE name = 'Fazenda Nordeste'), 2024, 'Cana de Açúcar'),
((SELECT id FROM farm WHERE name = 'Fazenda Nordeste'), 2024, 'Milho'),
((SELECT id FROM farm WHERE name = 'Fazenda Nordeste'), 2025, 'Algodão');