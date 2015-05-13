-- MySQL dump 10.13  Distrib 5.5.41, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: cndprdb
-- ------------------------------------------------------
-- Server version	5.5.41-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `cndprdb`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cndprdb` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `cndprdb`;

--
-- Table structure for table `catalog`
--

DROP TABLE IF EXISTS `catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(500) NOT NULL,
  `type` varchar(500) NOT NULL,
  `title` varchar(128) NOT NULL,
  `desc` varchar(256) NOT NULL,
  `length` varchar(500) NOT NULL,
  `price` varchar(500) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `entered_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `removed_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `path` varchar(250) NOT NULL,
  PRIMARY KEY (`code`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog`
--

LOCK TABLES `catalog` WRITE;
/*!40000 ALTER TABLE `catalog` DISABLE KEYS */;
INSERT INTO `catalog` VALUES (51,'CECS 4060','Programming','Computer Algorithms 3.3','Principles of design ','','500',0,'2015-04-27 14:01:14','0000-00-00 00:00:00','/var/www/html/eLearning/admin/files/51'),(61,'CECS 4061','Programming','Computer Algorithms 3.1','Principles of design ','','501',1,'2015-05-05 14:14:55','0000-00-00 00:00:00','/var/www/html/eLearning/admin/files/61'),(47,'CECS 4080','Programming','Computer Algorithms 2','Designing Principles ','','500',0,'2015-04-26 00:48:32','0000-00-00 00:00:00','/var/www/html/eLearning/admin/files/47'),(49,'Cecs 4567','Computer Science','Computer Graphics III','Learn how to be noemal!!!','','100',0,'2015-04-26 00:53:45','0000-00-00 00:00:00','/var/www/html/eLearning/admin/files/49'),(55,'CECS 5000','Programming','Advanced Programming II','Learn ultimate skills in programming','','600',0,'2015-05-05 00:16:15','0000-00-00 00:00:00','/var/www/html/eLearning/admin/files/55'),(32,'cecs4025','Computer Science','Computer Graphics','Lear how to rule the world!!!!','','100',1,'2015-04-23 01:04:03','0000-00-00 00:00:00','/var/www/html/eLearning/admin/files/32'),(46,'cecs5050','Computer Science','Computer Graphics II','Lear how to rule the world!!!!','','100',1,'2015-04-26 00:44:22','0000-00-00 00:00:00','/var/www/html/eLearning/admin/files/46'),(53,'COE 3010','Computer Engineer','Advance Programing ','Learn how to program in Java Server Pages','','100',1,'2015-04-30 01:28:06','0000-00-00 00:00:00','/var/www/html/eLearning/admin/files/53'),(54,'PSY 101','Psychology','General Psychology','theories','','565',0,'2015-04-30 01:37:20','0000-00-00 00:00:00','/var/www/html/eLearning/admin/files/54');
/*!40000 ALTER TABLE `catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exams` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `course` varchar(250) NOT NULL,
  `questions` int(10) unsigned NOT NULL,
  `username` varchar(250) NOT NULL,
  `created` date NOT NULL,
  `active` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course` (`course`),
  KEY `username` (`username`),
  CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`course`) REFERENCES `catalog` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `exams_ibfk_2` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES (19,'CECS 5000',4,'honu08','2015-05-05',1),(21,'CECS 4080',2,'honu08','2015-05-05',1),(22,'cecs4025',4,'honu08','2015-05-05',1);
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login` (
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `session` int(11) DEFAULT NULL,
  `role` varchar(10) NOT NULL,
  KEY `username` (`username`),
  CONSTRAINT `login_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `orders` (
  `username` varchar(250) NOT NULL,
  `id` int(10) NOT NULL,
  `status` varchar(30) NOT NULL,
  `total_amount` int(10) NOT NULL,
  KEY `id` (`id`),
  FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `order_detail` (
  `id` int(10) NOT NULL,
  `code` varchar(250) NOT NULL,
  `amount` int(30) NOT NULL,
  FOREIGN KEY (`code`) REFERENCES `catalog` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `enroll` (
  `username` varchar(250) NOT NULL,
  `code` varchar(250) NOT NULL,
  FOREIGN KEY (`code`) REFERENCES `catalog` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES ('adielperez','Unaprueba',NULL,'user'),('jan1','jan01',NULL,'user'),('kikojones','kiko12345',NULL,'admin'),('honu08','1234',883163210,'admin'),('user','user',634976810,'user'),('dndnxj','qwe',565046705,'admin'),('tcollazo','tainy12321',681082778,'user'),('CVD-PR','elearning2',754781881,'admin'),('sand3r','loco',46027122,'admin'),('dmiralles','123great',508891289,'user'),('Acampo','password123',720729443,'admin'),('q','q',236389869,'user'),('ecaballerojr','Zarathustra1',493275941,'admin'),('o','o',NULL,'user'),('timeout','S4biam3d!',842007218,'user'),('a','honu',NULL,'user'),('rafaelito','rafaelito123',NULL,'user'),('jsierra','Chuleta1',307950970,'user'),('adielpf','VepP455',NULL,'admin');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paypal_testing`
--

DROP TABLE IF EXISTS `paypal_testing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paypal_testing` (
  `amount` int(10) NOT NULL,
  `product` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paypal_testing`
--

LOCK TABLES `paypal_testing` WRITE;
/*!40000 ALTER TABLE `paypal_testing` DISABLE KEYS */;
INSERT INTO `paypal_testing` VALUES (15,'marijuana'),(12,''),(12,''),(12,'Completed'),(12,'Declined');
/*!40000 ALTER TABLE `paypal_testing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profession`
--

DROP TABLE IF EXISTS `profession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profession` (
  `category` varchar(150) NOT NULL,
  `code` int(11) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profession`
--

LOCK TABLES `profession` WRITE;
/*!40000 ALTER TABLE `profession` DISABLE KEYS */;
INSERT INTO `profession` VALUES ('Psychologist',10),('Engineer',20),('Dietitian',30),('Nutritionist',40),('Nurse',50),('Social Worker',80);
/*!40000 ALTER TABLE `profession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(250) NOT NULL,
  `question` varchar(250) NOT NULL,
  `answer` varchar(250) NOT NULL,
  `choiceA` varchar(250) NOT NULL,
  `choiceB` varchar(250) NOT NULL,
  `choiceC` varchar(250) NOT NULL,
  `active` int(2) NOT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `code` (`code`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`code`) REFERENCES `catalog` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (7,'CECS 4080','poi','poi','poi','po','ipoi',1),(8,'CECS 4060','poiu','poiu','opiu','poiu','poiu',1),(9,'CECS 4060','dfgsdfgsdfgsdfgsdf','mk','mk','mk','mk',1),(10,'cecs4025','cuantos aÃ±os tienes?','18','90','78','115',1),(11,'cecs4025','cual es tu hobby favorito!','deporte','manualidades','musica','arte',1),(12,'cecs4025','Cuantas patas tiene el gato?','4','2','3','1',1),(13,'cecs4025','Cual es profecion que aspiras?','ingeniero','doctor','abogado','dietista',1),(14,'cecs4025','Cual es tu apellido paterno?','rodriguez','mendoza','santiago','quilez',1),(15,'cecs4025','Cual es profecion que aspiras','audiaaaaaaa','ferrari','bmw','nissan',1),(16,'cecs4025','Cuanto es 2 + 2?','3','6','7','8',0),(17,'cecs4025','Omar entro 6 preguntas en menos de 5 horas?','waosssssss','bah','y que?','nah/',1),(18,'cecs4025','Otra pregunta insertada por Omar.','ajah','y que!','que bien','no importa',1),(19,'cecs4025','a','a','a','a','a',1),(20,'cecs4025','o','o','o','o','o',1),(21,'COE 3010','Cual es la profecion de Emily?','Psycologa','Doctora Medica','Ingeniera','Abogada',1),(22,'PSY 101','Quien es conocido como el padre del psicoanalisis?','Sigmund Freud','Noah Chomsky','Alfred Adler','Omar Rodriguez',1),(23,'CECS 4080','como se llame el pero de alexander?','cokito','budy','goliath','Sativiris',1),(24,'cecs4025','lkj','lkj','lkj','lkj','lkj',1),(25,'cecs4025','mnb','nmb','mnb','mnb','nmb',1),(26,'cecs4025','ghj','gh','gh','gh','gh',1),(27,'cecs4025','oiuOIU9090909090909090909','oiu','oiu','oiu','oiu',1),(28,'CECS 5000','What makes a loop?','Make a repetition possible','pupu','declare variable','end statement',1),(29,'CECS 5000','What makes a while statement?','Allow a block of code to be performed until a condition is false.','popi','negate a statement','a comparison',1),(30,'CECS 5000','What is int?','a data type that holds integers numbers','an interesting issue','pipo','an iterator',0),(31,'CECS 5000','What is a char?','a data type that holds characters','pepe','short for chairminion','a casting',1),(32,'CECS 5000','What is a string?','a data type that holds an array of characters.','pipi','a chain of whiles','the rope you use to climb a mountain',1);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `username` varchar(250) NOT NULL,
  `session` varchar(250) NOT NULL,
  `time` date NOT NULL,
  KEY `username` (`username`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('user','859363371','2015-05-11');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `name` varchar(150) NOT NULL,
  `lastName` varchar(150) NOT NULL,
  `license` varchar(150) NOT NULL,
  `address` varchar(500) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(150) NOT NULL,
  `username` varchar(250) NOT NULL,
  `profession` varchar(150) NOT NULL,
  `inscriptionDate` date NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `license` (`license`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('a','a','a','a','a@a.com','a','a','Engineer','2015-04-10'),('Andres','Campo','12847','Montehiedra','campo.andres@gmail.com','787555555','Acampo','Engineer','2015-03-31'),('Adiel','GarcÃ­a RosellÃ³','459999828829oe8','PO Box 7777 San SebastiÃ¡n, UK 98045','someone@gmail.com','787-555-5555','adielperez','Engineer','2015-03-26'),('Adiel','PÃ©rez','7777777','PO Box 1126 San Sebastian, PR 00685','adielpf@gmail.com','787-777-8888','adielpf','Engineer','2015-05-06'),('Christian','Valentin','0123456789','Far Away','prValentin@gmail.com','787-555-5555','CVD-PR','Psychologist','2015-03-30'),('Damian','Miralles','9876','284 calle A','dmiralles2009@yahoo.com','7876666666','dmiralles','Engineer','2015-03-30'),('ajdhd','xhxhx','ajfhfjdj','xndjdjd','xnxjxjx@123.com','xbxjxjx','dndnxj','Dietitian','2015-03-29'),('Enrique','Caballero','000000','000 Calle A #111','user@domain.com','000-000-0000','ecaballerojr','Engineer','2015-04-06'),('Omar','Rodriguez','80863','las delicias','djhonu_31@hotmail.com','7876788765','honu08','Engineer','2015-03-28'),('Jan','Alicea','425456567','Hc 02 Box 6513','luis_alicea24@hotmail.com','7873132673','jan1','Engineer','2015-03-27'),('Jose','Sierra','11111','Calle Sol','jsierra@sabiamed.com','787-959-9999','jsierra','Social Worker','2015-04-13'),('kiko','Kiko','19191919','8786 hahaha','kiko@koko.com','6765655443','kikojones','Nutritionist','2015-03-27'),('o','o','o','o','o@o.com','o','o','Engineer','2015-04-07'),('Q','q','q','q','q@d.com','q','q','Psychologist','2015-04-04'),('Rafael','Tortuga Ninja','ABC 123','Sewer Avenue 123 San Juan, PR 009XX','ralph@splinter.com','787-777-7777','rafaelito','Engineer','2015-04-11'),('Alexander','Sanchez','1234567','123 pescao','sand3r@gmail.com','12345678','sand3r','Engineer','2015-03-30'),('Tainy','Collazo','12321','Urb.San Rafael','tcollazo@sabiamed.com','7873876660','tcollazo','Social Worker','2015-03-30'),('Daniel','Guzman','4325545','Urb Notre Dame Calle San Pedro K5 Caguas','guzmandaniel62@yahoo.com','787-653-7000','timeout','Nurse','2015-04-08'),('user','user','1234','user','user@user.com','user','user','Nurse','2015-03-29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-05-11 19:47:25
