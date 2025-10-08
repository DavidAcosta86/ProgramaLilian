-- Init script for Programa Lilian MySQL database
-- This script will run when MySQL container starts for the first time
-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS lilian_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Use the database
USE lilian_dev;
-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'lilian' @'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON lilian_dev.* TO 'lilian' @'%';
FLUSH PRIVILEGES;
-- Optionally create tables (but Spring Boot will handle this with ddl-auto)
-- Users, Donations tables will be created automatically by Hibernate