CREATE DATABASE IF NOT EXISTS `externadodb1` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `externadodb1`;

-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: externadodb
-- ------------------------------------------------------
-- Server version	8.0.34
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `externado_admin`
--
DROP TABLE IF EXISTS `externado_admin`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_admin` (
    `externado_user_id` int NOT NULL COMMENT 'ID de Tabla',
    `externado_admin_firstname` varchar(60) NOT NULL COMMENT 'Nombres del Administrador',
    `externado_admin_lastname` varchar(60) NOT NULL COMMENT 'Apellidos del Administrador',
    `externado_carnet` varchar(45) NOT NULL COMMENT 'Número de Carnet del Administrador',
    `externado_admin_active` tinyint (1) NOT NULL DEFAULT '1' COMMENT 'Este campo si posee 1, indica que el usuario está activo en el sistema, caso contrario, indica que está inactivo',
    `externado_creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de registro',
    PRIMARY KEY (`externado_user_id`),
    UNIQUE KEY `externado_adminscol_UNIQUE` (`externado_user_id`),
    CONSTRAINT `fk_user_admins_id` FOREIGN KEY (`externado_user_id`) REFERENCES `externado_user` (`idexternado_user`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla de información acerca de los usuarios administradores del sistema';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_admin`
--
LOCK TABLES `externado_admin` WRITE;

/*!40000 ALTER TABLE `externado_admin` DISABLE KEYS */;

INSERT INTO
  `externado_admin`
VALUES
  (
    1,
    'Administrador',
    'Principal',
    '',
    1,
    '2023-11-03 14:21:38'
  );

/*!40000 ALTER TABLE `externado_admin` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_admin_system`
--
DROP TABLE IF EXISTS `externado_admin_system`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_admin_system` (
    `idexternado_admin_system` int NOT NULL COMMENT 'ID de Tabla',
    `externado_generic_pass` varchar(60) NOT NULL COMMENT 'Código de acceso utilizado para la creación de usuarios en el sistema, dependiendo del periodo de matrícula en el que se esté. Este código debe ser ÚNICO',
    `externado_range_period` varchar(9) NOT NULL COMMENT 'Título del periodo de matrícula, ejemplo: ''2022 - 2023''',
    `externado_active_period` tinyint (1) NOT NULL DEFAULT '1' COMMENT 'Este campo indica si el periodo está activo o no. Si el valor es "1", el periodo está activo, caso contrario el valor será "0"',
    `externado_system_closed` tinyint (1) NOT NULL DEFAULT '1' COMMENT 'Este campo permite realizar logins al sistema por parte de los padres de familia. Si el valor es "0", los logins estarán inhabilitados, caso contrario, podrán realizar login los padres de familia',
    PRIMARY KEY (`idexternado_admin_system`),
    UNIQUE KEY `idexternado_generic_pass_UNIQUE` (`idexternado_admin_system`),
    UNIQUE KEY `externado_generic_pass_UNIQUE` (`externado_generic_pass`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla de parámetros de control del sistema en general';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_admin_system`
--
LOCK TABLES `externado_admin_system` WRITE;

/*!40000 ALTER TABLE `externado_admin_system` DISABLE KEYS */;

INSERT INTO
  `externado_admin_system`
VALUES
  (1, 'MAT_2023', '2022-2023', 1, 1);

/*!40000 ALTER TABLE `externado_admin_system` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_church`
--
DROP TABLE IF EXISTS `externado_church`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_church` (
    `idexternado_church` int NOT NULL COMMENT 'ID de Tabla',
    `externado_church_value` varchar(45) NOT NULL COMMENT 'Nombres de iglesias',
    PRIMARY KEY (`idexternado_church`),
    UNIQUE KEY `idexternado_church_UNIQUE` (`idexternado_church`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla catálogo con información de iglesias proporcionadas por el Externado de San José';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_church`
--
LOCK TABLES `externado_church` WRITE;

/*!40000 ALTER TABLE `externado_church` DISABLE KEYS */;

INSERT INTO
  `externado_church`
VALUES
  (0, 'Favor seleccionar un valor'),
  (1, 'Mormones'),
  (2, 'Luterana'),
  (3, 'Adventista'),
  (4, 'Bautista'),
  (5, 'Asambleas de Dios'),
  (6, 'Testigos de Jehová'),
  (7, 'Unión Centroamericana'),
  (8, 'Tabernáculo bíblico bautista'),
  (9, 'Otra');

/*!40000 ALTER TABLE `externado_church` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_department`
--
DROP TABLE IF EXISTS `externado_department`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_department` (
    `idexternado_departments` int NOT NULL COMMENT 'ID de Tabla',
    `externado_department` varchar(30) NOT NULL COMMENT 'Nombres de departamentos',
    PRIMARY KEY (`idexternado_departments`),
    UNIQUE KEY `idexternado_department_UNIQUE` (`idexternado_departments`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla catálogo con información de los departamentos de El Salvador';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_department`
--
LOCK TABLES `externado_department` WRITE;

/*!40000 ALTER TABLE `externado_department` DISABLE KEYS */;

INSERT INTO
  `externado_department`
VALUES
  (0, 'Favor seleccionar un valor'),
  (1, 'Ahuachapán'),
  (2, 'Cabañas'),
  (3, 'Chalatenango'),
  (4, 'Cuscatlán'),
  (5, 'La Libertad'),
  (6, 'La Paz'),
  (7, 'La Unión'),
  (8, 'Morazán'),
  (9, 'San Miguel'),
  (10, 'San Salvador'),
  (11, 'San Vicente'),
  (12, 'Santa Ana'),
  (13, 'Sonsonate'),
  (14, 'Usulután');

/*!40000 ALTER TABLE `externado_department` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_incoming`
--
DROP TABLE IF EXISTS `externado_incoming`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_incoming` (
    `idexternado_incomings` int NOT NULL COMMENT 'ID de Tabla',
    `externado_incomings_value` varchar(45) NOT NULL COMMENT 'Distintos rangos de ingresos',
    PRIMARY KEY (`idexternado_incomings`),
    UNIQUE KEY `idexternado_incomings_UNIQUE` (`idexternado_incomings`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla catálogo con información de rangos de ingresos proporcionadas por el Externado de San José';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_incoming`
--
LOCK TABLES `externado_incoming` WRITE;

/*!40000 ALTER TABLE `externado_incoming` DISABLE KEYS */;

INSERT INTO
  `externado_incoming`
VALUES
  (0, 'Favor seleccionar un valor'),
  (1, 'Desde $0 a $500 dólares mensuales'),
  (2, 'Desde $501 a $1,000 dólares mensuales'),
  (3, 'Desde $1,001 a $1,500 dólares mensuales'),
  (4, 'Desde $1,501 a $2,000 dólares mensuales'),
  (5, 'Desde $2,001 a $2,500 dólares mensuales'),
  (6, 'Desde $2,501 a $3,000 dólares mensuales'),
  (7, 'Otro');

/*!40000 ALTER TABLE `externado_incoming` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_level`
--
DROP TABLE IF EXISTS `externado_level`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_level` (
    `idexternado_level` int NOT NULL COMMENT 'ID de Tabla',
    `externado_level` varchar(35) NOT NULL COMMENT 'Distintos niveles de estudio',
    PRIMARY KEY (`idexternado_level`),
    UNIQUE KEY `idexternado_representative_UNIQUE` (`idexternado_level`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla catálogo con información de los distintos niveles académicos proporcionadas por el Externado de San José';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_level`
--
LOCK TABLES `externado_level` WRITE;

/*!40000 ALTER TABLE `externado_level` DISABLE KEYS */;

INSERT INTO
  `externado_level`
VALUES
  (0, 'Favor seleccionar un valor'),
  (1, 'Parvularia 4'),
  (2, 'Parvularia 5'),
  (3, 'Preparatoria'),
  (4, 'Primero'),
  (5, 'Segundo'),
  (6, 'Tercero'),
  (7, 'Cuarto Matutino'),
  (8, 'Cuarto Vespertino'),
  (9, 'Quinto Matutino'),
  (10, 'Quinto Vespertino'),
  (11, 'Sexto Matutino'),
  (12, 'Sexto Vespertino'),
  (13, 'Séptimo Matutino'),
  (14, 'Séptimo Vespertino'),
  (15, 'Octavo Matutino'),
  (16, 'Octavo Vespertino'),
  (17, 'Noveno Matutino'),
  (18, 'Noveno Vespertino'),
  (19, 'Primero de Bachillerato'),
  (20, 'Segundo de Bachillerato');

/*!40000 ALTER TABLE `externado_level` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_pep`
--
DROP TABLE IF EXISTS `externado_pep`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_pep` (
    `idexternado_pep` int NOT NULL COMMENT 'ID de Tabla',
    `externado_pep_value` varchar(45) NOT NULL COMMENT 'Diferentes ocupaciones de Personas Políticamente Expuestas',
    PRIMARY KEY (`idexternado_pep`),
    UNIQUE KEY `idexternado_pep_UNIQUE` (`idexternado_pep`),
    UNIQUE KEY `externado_pep_value_UNIQUE` (`externado_pep_value`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla catálogo con información de puestos de Personas Políticamente Expuestas proporcionadas por el Externado de San José';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_pep`
--
LOCK TABLES `externado_pep` WRITE;

/*!40000 ALTER TABLE `externado_pep` DISABLE KEYS */;

INSERT INTO
  `externado_pep`
VALUES
  (4, 'Alcalde'),
  (8, 'Asistente de oficina del GOES'),
  (3, 'Diputado/a'),
  (6, 'Diputado/a suplente'),
  (0, 'Favor seleccionar un valor'),
  (5, 'Juez/a'),
  (1, 'Ministro/a'),
  (10, 'Otro'),
  (7, 'Secretario privado/a de GOES'),
  (9, 'Sindicalista de Institución Gubernamental'),
  (2, 'Viceministro/a');

/*!40000 ALTER TABLE `externado_pep` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_responsible`
--
DROP TABLE IF EXISTS `externado_responsible`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_responsible` (
    `idexternado_responsible` int NOT NULL COMMENT 'ID de Tabla',
    `externado_user_id` int NOT NULL COMMENT 'FK de tabla "externado_user"',
    `externado_firstname` varchar(60) DEFAULT NULL COMMENT 'Nombres del Responsables',
    `externado_lastname` varchar(60) DEFAULT NULL COMMENT 'Apellidos del Responsables',
    `externado_birthdate` date DEFAULT NULL COMMENT 'Cumpleaño del Responsable',
    `externado_id_type` tinyint (1) DEFAULT NULL COMMENT 'Si este valor es igual a "0", el ID hace referencia al DUI, caso contrario hace referencia a Pasaporte',
    `externado_id` varchar(20) DEFAULT NULL COMMENT 'Valor de DUI o Pasaporte',
    `externado_nit` varchar(20) DEFAULT NULL COMMENT 'NIT',
    `externado_nationality` varchar(30) DEFAULT NULL COMMENT 'Nacionalidad del Responsable',
    `externado_address` varchar(120) DEFAULT NULL COMMENT 'Dirección del Responsable',
    `externado_town` varchar(30) DEFAULT NULL COMMENT 'Municipio del Responsable',
    `externado_department_id` int DEFAULT NULL COMMENT 'FK de tabla "externado_department"',
    `externado_work_phone` varchar(20) DEFAULT NULL COMMENT 'Teléfono del trabajo del Responsable',
    `externado_mobile_phone` varchar(20) DEFAULT NULL COMMENT 'Teléfono movil del Responsable',
    `externado_email` varchar(60) DEFAULT NULL COMMENT 'Correo electrónico del Responsable',
    `externado_occupation` varchar(120) DEFAULT NULL COMMENT 'Ocupación del Responsable',
    `externado_workplace` varchar(120) DEFAULT NULL COMMENT 'Lugar de trabajo del Responsable',
    `externado_jobposition` varchar(120) DEFAULT NULL COMMENT 'Posición del cargo del Responsable',
    `externado_pep` tinyint (1) DEFAULT NULL COMMENT 'Si el Responsable es una Persona Políticamente Expuesta, este valor será "1", caso contrario será "0"',
    `externado_pep_occupation_id` int DEFAULT NULL COMMENT 'FK de tabla "externado_pep"',
    `externado_pep_occupation_other` varchar(120) DEFAULT NULL COMMENT 'Si el puesto del PEP no aparece en el catálogo, acá se guardará el valor a especificar',
    `externado_pep_3years` tinyint (1) DEFAULT NULL COMMENT 'Si el Responsable ha sido una Persona Políticamente Expuesta en los últimos 3 años, este valor será "1", caso contrario será "0"',
    `externado_pep_3years_occupation_id` int DEFAULT NULL COMMENT 'FK de tabla "externado_pep"',
    `externado_pep_3years_occupation_other` varchar(120) DEFAULT NULL COMMENT 'Si el puesto del PEP no aparece en el catálogo, acá se guardará el valor a especificar',
    `externado_incomings_id` int DEFAULT NULL COMMENT 'FK de tabla "externado_incoming"',
    `externado_incomings_other` varchar(120) DEFAULT NULL COMMENT 'Si el rango de ingreso  no aparece en el catálogo, acá se guardará el valor a especificar',
    `externado_former_externado_student` tinyint (1) DEFAULT NULL COMMENT 'Si el Responsable es un estudiante que se formó en el Externado de San José, este valor será "1", caso contrario será "0"',
    `externado_university_studies` varchar(120) DEFAULT NULL COMMENT 'Si el Responsable estudió en alguna universidad, acá se especificará el nombre de dicha universidad',
    `externado_responsible_relationship` varchar(45) DEFAULT NULL COMMENT 'Si el Responsable no es uno de los padres de familia, acá se especificará el parentezco',
    `externado_direct_responsible` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'Si el Responsable es un responsable directo del estudiante, acá se colocará "1", caso contrario se colocará "0" (este campo no se utiliza de momento)',
    `externado_responsible_type_id` int NOT NULL DEFAULT '1' COMMENT 'FK de tabla "externado_responsible_type"',
    `externado_form_valid` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'Campo de control para indicar si el formulario del Responsable ha llenado todos los campos mandatorios del formulario. Si ya completó todos los campos, acá irá "1", caso contrario irá "0" (bandera necesaria para generar los archivos PDF)',
    `externado_active` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'Si el registro del Responsable está activo, se colocará "1", caso contrario "0"',
    `externado_historical` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'Campo de control para definir registros historicos. De momento no se implementará esta funcionalidad',
    `externado_creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de registro',
    PRIMARY KEY (`idexternado_responsible`),
    UNIQUE KEY `idexternado_parents_UNIQUE` (`idexternado_responsible`),
    KEY `fk_user_parents_id_idx` (`externado_user_id`),
    KEY `fk_reptype_parents_id_idx` (`externado_responsible_type_id`),
    KEY `fk_department_representatives_id_idx` (`externado_department_id`),
    KEY `fk_pep_responsible_id_idx` (
      `externado_pep_occupation_id`,
      `externado_pep_3years_occupation_id`
    ),
    KEY `fk_3year_pep_responsible_id_idx` (`externado_pep_3years_occupation_id`),
    KEY `fk_incoming_responsible_id_idx` (`externado_incomings_id`),
    CONSTRAINT `fk_3year_pep_responsible_id` FOREIGN KEY (`externado_pep_3years_occupation_id`) REFERENCES `externado_pep` (`idexternado_pep`),
    CONSTRAINT `fk_department_responsible_id` FOREIGN KEY (`externado_department_id`) REFERENCES `externado_department` (`idexternado_departments`),
    CONSTRAINT `fk_incoming_responsible_id` FOREIGN KEY (`externado_incomings_id`) REFERENCES `externado_incoming` (`idexternado_incomings`),
    CONSTRAINT `fk_pep_responsible_id` FOREIGN KEY (`externado_pep_occupation_id`) REFERENCES `externado_pep` (`idexternado_pep`),
    CONSTRAINT `fk_resptype_responsible_id` FOREIGN KEY (`externado_responsible_type_id`) REFERENCES `externado_responsible_type` (`idexternado_responsible_type`),
    CONSTRAINT `fk_user_responsible_id` FOREIGN KEY (`externado_user_id`) REFERENCES `externado_user` (`idexternado_user`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla de información acerca de los responsables de los estudiantes del Colegio Externado de San José';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_responsible`
--
LOCK TABLES `externado_responsible` WRITE;

/*!40000 ALTER TABLE `externado_responsible` DISABLE KEYS */;

/*!40000 ALTER TABLE `externado_responsible` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_responsible_type`
--
DROP TABLE IF EXISTS `externado_responsible_type`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_responsible_type` (
    `idexternado_responsible_type` int NOT NULL COMMENT 'ID de Tabla',
    `externado_responsible_type` varchar(45) NOT NULL COMMENT 'Distintos tipos de Responsables',
    PRIMARY KEY (`idexternado_responsible_type`),
    UNIQUE KEY `idexternado_representant_type_UNIQUE` (`idexternado_responsible_type`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla catálogo con información de los distintos tipos de responsables del estudiante';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_responsible_type`
--
LOCK TABLES `externado_responsible_type` WRITE;

/*!40000 ALTER TABLE `externado_responsible_type` DISABLE KEYS */;

INSERT INTO
  `externado_responsible_type`
VALUES
  (1, 'Mamá'),
  (2, 'Papá'),
  (3, 'Tutor Legal');

/*!40000 ALTER TABLE `externado_responsible_type` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_sequence`
--
DROP TABLE IF EXISTS `externado_sequence`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_sequence` (
    `idexternado_sequence` int NOT NULL COMMENT 'ID de Tabla',
    `idexternado_user_sequence` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_users"',
    `idexternado_admin_sequence` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_admins" (actualmente no se utiliza, en su lugar se replica el ID de "externado"user")',
    `idexternado_responsible_sequence` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_responsible"',
    `idexternado_student_sequence` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_student"',
    `idexternado_admin_system_sequence` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_admin_system"',
    `idexternado_level` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_level"',
    `idexternado_department` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_department"',
    `idexternado_pep` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_pep"',
    `idexternado_incomings` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_incoming"',
    `idexternado_church` int NOT NULL COMMENT 'Secuencia del ID de la tabla "externado_church"',
    PRIMARY KEY (`idexternado_sequence`),
    UNIQUE KEY `idexternado_sequence_UNIQUE` (`idexternado_sequence`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla que almacena la información de las sequencias para los distintos PK de las tablas de la base de datos';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_sequence`
--
LOCK TABLES `externado_sequence` WRITE;

/*!40000 ALTER TABLE `externado_sequence` DISABLE KEYS */;

INSERT INTO
  `externado_sequence`
VALUES
  (1, 2, 2, 1, 1, 2, 21, 15, 11, 8, 10);

/*!40000 ALTER TABLE `externado_sequence` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_student`
--
DROP TABLE IF EXISTS `externado_student`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_student` (
    `idexternado_student` int NOT NULL COMMENT 'ID de Tabla',
    `externado_user_id` int NOT NULL COMMENT 'FK de tabla "externado_user"',
    `externado_student_firstname` varchar(60) DEFAULT NULL COMMENT 'Nombres del Estudiante',
    `externado_student_lastname` varchar(60) DEFAULT NULL COMMENT 'Apellidos del Estudiante',
    `externado_student_birthplace` varchar(120) DEFAULT NULL COMMENT 'Lugar de nacimiento del Estudiante',
    `externado_student_birthdate` date DEFAULT NULL COMMENT 'Fecha de nacimiento del Estudiante',
    `externado_student_nationality` varchar(30) DEFAULT NULL COMMENT 'Nacionalidad del Estudiante',
    `externado_student_gender` tinyint (1) DEFAULT NULL COMMENT 'Genero del EstudianteStudent gender. Si el valor es "0", indica "Masculino", caso contrario, indica "Femenino"',
    `externado_student_address` varchar(120) DEFAULT NULL COMMENT 'Dirección del Estudiante',
    `externado_student_town` varchar(30) DEFAULT NULL COMMENT 'Municipio del Estudiante',
    `externado_student_department_id` int DEFAULT NULL COMMENT 'FK de tabla "externado_department"',
    `externado_student_phone` varchar(20) DEFAULT NULL COMMENT 'Número de celular del Estudiante',
    `externado_student_email` varchar(60) DEFAULT NULL COMMENT 'Correo electrónico del Estudiante',
    `externado_student_last_school` varchar(120) DEFAULT NULL COMMENT 'Última escuela donde estudio el Estudiante',
    `externado_student_current_level_id` int DEFAULT NULL COMMENT 'FK de tabla "externado_level". Indica el año que cursará el estudiante',
    `externado_student_has_siblings` tinyint (1) DEFAULT NULL COMMENT 'Si el estudiante tiene hermanos estudiando en el Externado se colocará "1" si es caso afirmativo, "0" caso negativo',
    `externado_student_siblings` varchar(420) DEFAULT NULL COMMENT 'Este valor será una cadena que contendrá un JSON éste estará conformado por 3 JSON hijos con etiquetas "name" y "grade"',
    `externado_student_lives_with_parents` tinyint (1) DEFAULT NULL COMMENT 'Si el Estudiante vive con ambos padres, este valor será "1", caso contrario, será "0"',
    `externado_student_lives_with_who` varchar(60) DEFAULT NULL COMMENT 'Si "externado_student_lives_with_parents" = 0, entonces acá se especificará el nombre de con quién vive',
    `externado_student_lives_with_related` varchar(60) DEFAULT NULL COMMENT 'Si "externado_student_lives_with_parents" = 0, entonces acá se especificará el parentesco de la persona con el estudiante',
    `externado_student_lives_with_address` varchar(120) DEFAULT NULL COMMENT 'Si "externado_student_lives_with_parents" = 0, entonces acá se especificará la dirección de la persona con la que vive el Estudiante',
    `externado_student_catholic` tinyint (1) DEFAULT NULL COMMENT 'Si el Estudiante es católico, acá se almacenará "1", caso contrario, se almacenará "0"',
    `externado_student_non_catholic_church_id` int DEFAULT NULL COMMENT 'FK de tabla "externado_church". Si "externado_student_catholic" = 0, entonces se seleccionará una iglesia del catálogo de iglesias',
    `externado_student_church_other` varchar(45) DEFAULT NULL COMMENT 'Si "externado_student_catholic" = 0 y en el catálogo de iglesias se selecciona la opción "Otra", entonces acá se almacenará el valor que defina el usuario',
    `externado_student_emergency_name` varchar(60) DEFAULT NULL COMMENT 'Nombre de contacto de emergencia del Estudiante',
    `externado_student_emergency_relationship` varchar(45) DEFAULT NULL COMMENT 'Parentesco del contacto de emergencia del Estudiante',
    `externado_student_emergency_address` varchar(120) DEFAULT NULL COMMENT 'Dirección del contacto de emergencia del Estudiante',
    `externado_student_emergency_phone` varchar(20) DEFAULT NULL COMMENT 'Número de celular del contacto de emergencia del Estudiante',
    `externado_student_resp_type_id` int DEFAULT NULL COMMENT 'FK de tabla "externado_student_responsible_type". Se define el parentesco del responsable para con el Externado de parte del Estudiante',
    `externado_student_rep_other` varchar(45) DEFAULT NULL COMMENT 'Campo fuera de uso',
    `externado_student_rep_name` varchar(60) DEFAULT NULL COMMENT 'Si "externado_student_resp_type_id" = 4 ("Otro"), entonces acá se definirá el nombre del responsable para con el Externado de parte del Estudiante',
    `externado_student_rep_id_type` tinyint (1) DEFAULT NULL COMMENT 'If value = 0, the id specified is DUI, otherwise is passport',
    `externado_student_rep_id` varchar(20) DEFAULT NULL COMMENT 'Student representant ID at externado',
    `externado_student_rep_address` varchar(120) DEFAULT NULL COMMENT 'Student representant address at externado',
    `externado_student_rep_homephone` varchar(20) DEFAULT NULL COMMENT 'Student representant home phone number at externado',
    `externado_student_rep_work_phone` varchar(20) DEFAULT NULL COMMENT 'Student representant work phone number at externado',
    `externado_student_rep_mobile_phone` varchar(20) DEFAULT NULL COMMENT 'Student representant mobile phone number at externado',
    `externado_student_rep_email` varchar(60) DEFAULT NULL COMMENT 'Student representant email at externado',
    `externado_proccess_finished` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'This field indicate if full internal proccess at externado has been finished for this student. If value = 1, proccess is finished, otherwise value = 0',
    `externado_form_valid` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'If student data is completed (frontend validation), value = 1, otherwise value = 0 (This flag will be checked before PDF generation proccess)',
    `externado_student_active` tinyint (1) NOT NULL DEFAULT '1' COMMENT 'Value that indicate if is an active student. If is active, then value = 1, otherwise = 0',
    `externado_historical` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'If there is more than 1 register, the older registers will be use like historical data using value = 1 for it',
    `externado_creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation student Datetime',
    PRIMARY KEY (`idexternado_student`),
    UNIQUE KEY `idexternado_students_UNIQUE` (`idexternado_student`),
    KEY `fk_user_students_id_idx` (`externado_user_id`),
    KEY `fk_grades_students_id_idx` (`externado_student_current_level_id`),
    KEY `fk_department_students_id_idx` (`externado_student_department_id`),
    KEY `fk_student_rep_type_student_id_idx` (`externado_student_resp_type_id`),
    KEY `fk_church_student_id_idx` (`externado_student_non_catholic_church_id`),
    CONSTRAINT `fk_church_student_id` FOREIGN KEY (`externado_student_non_catholic_church_id`) REFERENCES `externado_church` (`idexternado_church`),
    CONSTRAINT `fk_department_students_id` FOREIGN KEY (`externado_student_department_id`) REFERENCES `externado_department` (`idexternado_departments`),
    CONSTRAINT `fk_grades_students_id` FOREIGN KEY (`externado_student_current_level_id`) REFERENCES `externado_level` (`idexternado_level`),
    CONSTRAINT `fk_student_rep_type_student_id` FOREIGN KEY (`externado_student_resp_type_id`) REFERENCES `externado_student_responsible_type` (`idexternado_student_responsible_type`),
    CONSTRAINT `fk_user_students_id` FOREIGN KEY (`externado_user_id`) REFERENCES `externado_user` (`idexternado_user`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Tabla de información acerca de los estudiantes a matricular en el Externado de San José';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_student`
--
LOCK TABLES `externado_student` WRITE;

/*!40000 ALTER TABLE `externado_student` DISABLE KEYS */;

/*!40000 ALTER TABLE `externado_student` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_student_responsible_type`
--
DROP TABLE IF EXISTS `externado_student_responsible_type`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_student_responsible_type` (
    `idexternado_student_responsible_type` int NOT NULL COMMENT 'ID de Tabla',
    `externado_student_responsible_type` varchar(30) NOT NULL COMMENT 'Diferentes tipos de responsables para estudiantes',
    PRIMARY KEY (`idexternado_student_responsible_type`),
    UNIQUE KEY `idexternado_student_representative_UNIQUE` (`idexternado_student_responsible_type`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_student_responsible_type`
--
LOCK TABLES `externado_student_responsible_type` WRITE;

/*!40000 ALTER TABLE `externado_student_responsible_type` DISABLE KEYS */;

INSERT INTO
  `externado_student_responsible_type`
VALUES
  (0, 'Favor seleccionar un valor'),
  (1, 'Mamá'),
  (2, 'Papá'),
  (3, 'Mamá y Papá'),
  (4, 'Otro');

/*!40000 ALTER TABLE `externado_student_responsible_type` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_user`
--
DROP TABLE IF EXISTS `externado_user`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_user` (
    `idexternado_user` int NOT NULL COMMENT 'Table ID',
    `externado_email` varchar(60) NOT NULL COMMENT 'User E-mail value',
    `externado_pass` varchar(100) NOT NULL COMMENT 'User Password Value',
    `externado_user_type_id` int NOT NULL DEFAULT '3' COMMENT 'ID from externado_user_type',
    `externado_active_user` tinyint (1) NOT NULL DEFAULT '1' COMMENT 'Value that indicate if the user is allowed to login',
    `externado_reset_password` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'Using forgot password proccess, this value will change to value = 1. This indicate that must change his password the next login',
    `externado_generic_pass` varchar(60) NOT NULL COMMENT 'Generic password used to create new user registers at system. Related with externado_admin_sistyem table',
    `externado_active_email` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'If the email is from a human, when the human confirms the account via email, this value wil be 1, otherwise will be 0',
    `externado_massive_created` tinyint (1) NOT NULL DEFAULT '0' COMMENT 'This field it is used only to identify all those users than have being created using a massive upload into the system. If value = 1, at the first login will create "externado_uuid" value. Otherwise, login will continue as usual',
    `externado_uuid` varchar(45) NOT NULL,
    `externado_creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation user Datetime',
    PRIMARY KEY (`idexternado_user`),
    UNIQUE KEY `idexternadousers_UNIQUE` (`idexternado_user`),
    UNIQUE KEY `email_UNIQUE` (`externado_email`),
    UNIQUE KEY `externado_uuid_UNIQUE` (`externado_uuid`),
    KEY `fk_userType_user_idx` (`externado_user_type_id`),
    CONSTRAINT `fk_userType_user` FOREIGN KEY (`externado_user_type_id`) REFERENCES `externado_user_type` (`idexternado_user_type`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Externado San Jose users Table. This table will be used to validate all logins into the system';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_user`
--
LOCK TABLES `externado_user` WRITE;

/*!40000 ALTER TABLE `externado_user` DISABLE KEYS */;

INSERT INTO
  `externado_user`
VALUES
  (
    1,
    'matricula@externado.edu.sv',
    '$2b$12$VAw/kIZ.mhjqVDMbxUYP/uC0/rAuy5NyACyjPeVuOIPCS.ZjVNMEu',
    1,
    1,
    0,
    'MAT_2023',
    1,
    0,
    'c12b1c92-93c8-510c-b425-e38f3783a721',
    '2023-10-23 17:16:48'
  );

/* La contraseña que aparece encriptada para este usario es la palabra "matricula" */;

/*!40000 ALTER TABLE `externado_user` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `externado_user_type`
--
DROP TABLE IF EXISTS `externado_user_type`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `externado_user_type` (
    `idexternado_user_type` int NOT NULL COMMENT 'Table ID',
    `externado_user_type` varchar(15) NOT NULL COMMENT 'User Type',
    PRIMARY KEY (`idexternado_user_type`),
    UNIQUE KEY `idexternado_user_type_UNIQUE` (`idexternado_user_type`),
    UNIQUE KEY `externado_user_type_UNIQUE` (`externado_user_type`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'Externado San Jose type-of-user Table. It define all different roles';

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externado_user_type`
--
LOCK TABLES `externado_user_type` WRITE;

/*!40000 ALTER TABLE `externado_user_type` DISABLE KEYS */;

INSERT INTO
  `externado_user_type`
VALUES
  (2, 'Admin'),
  (1, 'Super Admin'),
  (3, 'User'),
  (4, "Assistant");

/*!40000 ALTER TABLE `externado_user_type` ENABLE KEYS */;

UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Tabla intermedia
create table
  externado_student_period (
    id_student_period int AUTO_INCREMENT PRIMARY KEY,
    id_student int,
    id_period int,
    id_level int
  );

DELIMITER / / CREATE TRIGGER update_estudiante_periodo_trigger AFTER
UPDATE ON externado_student FOR EACH ROW BEGIN DECLARE period_active INT;

DECLARE count_records INT;

DECLARE current_level INT;

-- Verificar si el campo activo fue actualizado a 1
IF NEW.externado_proccess_finished = 1
AND OLD.externado_proccess_finished = 0 THEN
-- Obtener el ID del periodo activo
SELECT
  idexternado_admin_system INTO period_active
FROM
  externado_admin_system
WHERE
  externado_active_period = 1;

-- Verificar si la combinación id_estudiante e id_periodo ya existe en la tabla intermedia
SELECT
  COUNT(*) INTO count_records
FROM
  externado_student_period
WHERE
  id_student = NEW.idexternado_student
  AND id_period = period_active;

-- Si la combinación no existe, insertar el nuevo registro en estudiante_periodo
IF count_records = 0 THEN
INSERT INTO
  externado_student_period (id_student, id_period, id_level)
VALUES
  (
    NEW.idexternado_student,
    period_active,
    NEW.externado_student_current_level_id
  );

END IF;

END IF;

END;

/ / DELIMITER;

-- Modificacion a tabla level
UPDATE externado_level
SET
  externado_level = "Todos los grados"
WHERE
  idexternado_level = 0;

-- Nuevo registro a tabla externado_admin_system para tener la opción de descargar todos los periodos
-- (un registro inicial)
insert into
  externado_admin_system
values
  (9, "MAT2000", "Todos", 0, 1);

-- Dump completed on 2024-02-05 19:52:44