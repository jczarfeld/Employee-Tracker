DROP DATABASE IF EXISTS exployees;
CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
   id INT NOT NULL,
  name VARCHAR(255) NOT NULL,

PRIMARY KEY(id)
);

CREATE TABLE role (
-- define these tables -- might have to change it from "role" because it's blue
title VARCHAR(255) NOT NULL,
 id INT NOT NULL, 
 department_id INT NOT NULL,
 department_name VARCHAR(255) NOT NULL,
 salary INT NOT NULL,
       

       FOREIGN KEY (department_id)
  REFERENCES department(id)
  FOREIGN KEY (department_name)
  REFERENCES department(name)
  ON DELETE SET NULL
);

CREATE TABLE manager (
    id INT NOT NULL, 
    first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255) NOT NULL;
     PRIMARY KEY(id)

);

CREATE TABLE employee (
    id INT NOT NULL, 
    first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255) NOT NULL,
      role_title VARCHAR(255) NOT NULL,
       department VARCHAR(255) NOT NULL,
        salary INT NOT NULL,
        manager_id INT NOT NULL,
        role_id INT NOT NULL,
        manager VARCHAR(255); 

         FOREIGN KEY (manager_id)
  REFERENCES manager(id)
         FOREIGN KEY (role_id)
  REFERENCES role(id)
         FOREIGN KEY (role_title)
  REFERENCES role(title)
  ON DELETE SET NULL
-- define these tables

);