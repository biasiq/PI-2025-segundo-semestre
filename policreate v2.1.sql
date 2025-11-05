CREATE DATABASE policreate;

USE policreate;

CREATE TABLE usuario(
	id_usuario INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL UNIQUE,
    senha VARCHAR (255) NOT NULL,
    PRIMARY KEY (id_usuario)
);

CREATE TABLE materia(
	id_materia INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR (255) NOT NULL,
    PRIMARY KEY (id_materia)
);

CREATE TABLE assunto(
	id_assunto INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR (255) NOT NULL,
    id_materia INT NOT NULL,
    PRIMARY KEY (id_assunto),
    FOREIGN KEY (id_materia) REFERENCES materia(id_materia)
);

INSERT INTO usuario (nome, email, senha) VALUES 
('admin', 'admin@gmail.com', 'admin');

SELECT * FROM usuario;
SELECT * FROM materia;

DROP DATABASE policreate;