-- Migration: Tornar campos do Customer nullable para suportar anonimização LGPD
-- Data: 2025-01-XX
-- Descrição: Remove constraints NOT NULL e UNIQUE dos campos pessoais para permitir anonimização

-- Remover constraint UNIQUE de email (se existir)
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_email_key;

-- Remover constraint UNIQUE de cpf (se existir)
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_cpf_key;

-- Tornar campos nullable
ALTER TABLE customers ALTER COLUMN name DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN email DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN cpf DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN cep DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN address DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN number DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN neighborhood DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN city DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN state DROP NOT NULL;
