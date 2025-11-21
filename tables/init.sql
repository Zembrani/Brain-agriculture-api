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


-- Criação de indexes
-- Provavelmente deveria ser criado algum index, mas depende da regra de negócio.