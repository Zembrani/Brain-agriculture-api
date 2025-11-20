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
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    totalArea DECIMAL(10,2) NOT NULL,
    productiveArea DECIMAL(10,2) NOT NULL,
    nonProductiveArea DECIMAL(10,2) NOT NULL
);

-- Crop table
CREATE TABLE IF NOT EXISTS crop (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    year DECIMAL(4,0) NOT NULL,
    crops TEXT NOT NULL
);


-- Tabelas auxiliares

CREATE TABLE IF NOT EXISTS producerFarm (
    producerId BIGINT NOT NULL REFERENCES producer(id) ON DELETE CASCADE,
    farmId BIGINT NOT NULL REFERENCES farm(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS farmCrop (
    farmId BIGINT NOT NULL REFERENCES farm(id) ON DELETE CASCADE,
    cropId BIGINT NOT NULL REFERENCES crop(id) ON DELETE CASCADE
);


-- Criação de indexes
-- Provavelmente deveria ser criado algum index, mas depende da regra de negócio.