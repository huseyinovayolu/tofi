-- Initialize PostgreSQL with PostGIS for Swiss geographic data
-- This script runs when the database is first created

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

-- Create Swiss-specific geographic functions
-- Swiss coordinate system: CH1903+ / LV95 (EPSG:2056)

-- Function to convert Swiss coordinates to WGS84
CREATE OR REPLACE FUNCTION swiss_to_wgs84(x DOUBLE PRECISION, y DOUBLE PRECISION)
RETURNS GEOMETRY AS 
$$
BEGIN
    RETURN ST_Transform(ST_SetSRID(ST_MakePoint(x, y), 2056), 4326);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate distance between two Swiss addresses
CREATE OR REPLACE FUNCTION swiss_distance_km(geom1 GEOMETRY, geom2 GEOMETRY)
RETURNS DOUBLE PRECISION AS
$$
BEGIN
    RETURN ST_Distance(geom1::geography, geom2::geography) / 1000.0;
END;
$$ LANGUAGE plpgsql;

-- Function to validate Swiss postal codes
CREATE OR REPLACE FUNCTION is_valid_swiss_postal_code(code TEXT)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN code ~ '^\d{4}$' AND code::INTEGER BETWEEN 1000 AND 9999;
END;
$$ LANGUAGE plpgsql;

-- Create index for spatial queries (will be created by Prisma migrations)
-- These are examples of what we might need:

-- Common Swiss postal code mappings for development
-- In production, this would come from Swiss Post API
CREATE TABLE IF NOT EXISTS swiss_postal_codes (
    postal_code VARCHAR(4) PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    canton VARCHAR(2) NOT NULL,
    coordinates GEOMETRY(Point, 4326)
);

-- Insert some common Swiss postal codes for development
INSERT INTO swiss_postal_codes (postal_code, city_name, canton, coordinates) VALUES
('8001', 'Zürich', 'ZH', ST_SetSRID(ST_MakePoint(8.5417, 47.3769), 4326)),
('3001', 'Bern', 'BE', ST_SetSRID(ST_MakePoint(7.4474, 46.9480), 4326)),
('4001', 'Basel', 'BS', ST_SetSRID(ST_MakePoint(7.5886, 47.5596), 4326)),
('1201', 'Genève', 'GE', ST_SetSRID(ST_MakePoint(6.1432, 46.2044), 4326)),
('1000', 'Lausanne', 'VD', ST_SetSRID(ST_MakePoint(6.6323, 46.5197), 4326)),
('6900', 'Lugano', 'TI', ST_SetSRID(ST_MakePoint(8.9511, 46.0037), 4326)),
('9000', 'St. Gallen', 'SG', ST_SetSRID(ST_MakePoint(9.3767, 47.4245), 4326)),
('2000', 'Neuchâtel', 'NE', ST_SetSRID(ST_MakePoint(6.9310, 46.9930), 4326)),
('1700', 'Fribourg', 'FR', ST_SetSRID(ST_MakePoint(7.1512, 46.8059), 4326)),
('6000', 'Luzern', 'LU', ST_SetSRID(ST_MakePoint(8.3093, 47.0502), 4326))
ON CONFLICT (postal_code) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tofi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tofi;