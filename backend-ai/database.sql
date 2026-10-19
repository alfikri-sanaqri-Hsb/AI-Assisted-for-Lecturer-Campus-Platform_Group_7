DROP DATABASE IF EXISTS sahabat_alfary;

CREATE DATABASE sahabat_alfary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sahabat_alfary;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY ,
  email VARCHAR(255) UNIQUE NOT NULL ,
  password_hash VARCHAR(255) NOT NULL ,
  role ENUM('student', 'mentor', 'admin') DEFAULT 'student',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;



CREATE TABLE user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY ,
  user_id INT NOT NULL UNIQUE ,
  full_name VARCHAR(255) NOT NULL ,
  phone_number VARCHAR(20) ,
  profile_picture VARCHAR(255) ,
  date_of_birth DATE ,
  major VARCHAR(100) ,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ,
  INDEX idx_user_id (user_id) ,
  INDEX idx_major (major) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;


CREATE INDEX idx_users_email ON users(email);          
CREATE INDEX idx_profiles_user_id ON user_profiles(user_id);  