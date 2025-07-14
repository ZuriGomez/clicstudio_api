-- Run this in MySQL to create the DB and table
CREATE DATABASE IF NOT EXISTS clicstudio;

USE clicstudio;

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100) NOT NULL UNIQUE,
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
