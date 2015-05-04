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
  PRIMARY KEY (`code`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog`
--

LOCK TABLES `catalog` WRITE;
/*!40000 ALTER TABLE `catalog` DISABLE KEYS */;
INSERT INTO `catalog` VALUES (13,'100200','Type','Salud','qwerty','','qwerty',1,'2015-04-14 00:09:15','0000-00-00 00:00:00'),(6,'101','COOK','Porkchop Specialties','Discover  the specialties to cook porkchops','','100.00',1,'2015-04-10 01:48:58','0000-00-00 00:00:00'),(5,'123aa','123aa','123aa','123aa','123','123aa',0,'2015-04-08 14:13:11','0000-00-00 00:00:00'),(7,'coe4045','Enineering','Computer Programimng II','Learn how to program','','100',1,'2015-04-12 23:21:31','0000-00-00 00:00:00'),(8,'coe4050','Enineering','Computer Programimng III','Learn how to program object oriented','','150',1,'2015-04-12 23:23:28','0000-00-00 00:00:00'),(9,'coe4060','Enineering','Computer Programimng IV','Learn how to web program','','150',1,'2015-04-12 23:25:41','0000-00-00 00:00:00'),(12,'Hola01','Saludos','Como saludar en publico','Como saludar','','10',0,'2015-04-13 15:23:48','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `catalog` ENABLE KEYS */;
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


CREATE TABLE `questions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(250) NOT NULL,
  `question` varchar(250) NOT NULL,
  `answer` varchar(250) NOT NULL,
  `choiceA` varchar(250) NOT NULL,
  `choiceB` varchar(250) NOT NULL,
  `choiceC` varchar(250) NOT NULL,
   UNIQUE KEY `id` (`id`),
   FOREIGN KEY (`code`) REFERENCES `catalog` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `sessions` (
  `username` varchar(250) NOT NULL,
 `session` varchar(250) NOT NULL,
  `time` date NOT NULL,
   FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `exams` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `course` varchar(250) NOT NULL,
  `questions` int(10) unsigned NOT NULL,
  `username` varchar(250) NOT NULL,
  `created` date NOT NULL,
  `active` tinyint(4) NOT NULL,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`course`) REFERENCES `catalog` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`username`)REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
	
 `username` varchar(250) NOT NULL,
--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES ('adielperez','Unaprueba',NULL,'user'),('jan1','jan01',NULL,'user'),('kikojones','kiko12345',NULL,'user'),('honu08','1234',138310570,'admin'),('user','user',634976810,'user'),('dndnxj','qwe',565046705,'user'),('tcollazo','tainy12321',681082778,'user'),('CVD-PR','elearning2',754781881,'user'),('sand3r','loco',46027122,'user'),('dmiralles','123great',508891289,'user'),('Acampo','password123',720729443,'user'),('q','q',236389869,'user'),('ecaballerojr','Zarathustra1',493275941,'admin'),('o','o',NULL,'user'),('timeout','S4biam3d!',842007218,'user'),('a','honu',NULL,'user'),('rafaelito','rafaelito123',NULL,'user'),('jsierra','Chuleta1',307950970,'user');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
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
INSERT INTO `users` VALUES ('a','a','a','a','a@a.com','a','a','Engineer','2015-04-10'),('Andres','Campo','12847','Montehiedra','campo.andres@gmail.com','787555555','Acampo','Engineer','2015-03-31'),('Adiel','GarcÃ­a RosellÃ³','459999828829oe8','PO Box 7777 San SebastiÃ¡n, UK 98045','someone@gmail.com','787-555-5555','adielperez','Engineer','2015-03-26'),('Christian','Valentin','0123456789','Far Away','prValentin@gmail.com','787-555-5555','CVD-PR','Psychologist','2015-03-30'),('Damian','Miralles','9876','284 calle A','dmiralles2009@yahoo.com','7876666666','dmiralles','Engineer','2015-03-30'),('ajdhd','xhxhx','ajfhfjdj','xndjdjd','xnxjxjx@123.com','xbxjxjx','dndnxj','Dietitian','2015-03-29'),('Enrique','Caballero','000000','000 Calle A #111','user@domain.com','000-000-0000','ecaballerojr','Engineer','2015-04-06'),('Omar','Rodriguez','80863','las delicias','djhonu_31@hotmail.com','7876788765','honu08','Engineer','2015-03-28'),('Jan','Alicea','425456567','Hc 02 Box 6513','luis_alicea24@hotmail.com','7873132673','jan1','Engineer','2015-03-27'),('Jose','Sierra','11111','Calle Sol','jsierra@sabiamed.com','787-959-9999','jsierra','Social Worker','2015-04-13'),('kiko','Kiko','19191919','8786 hahaha','kiko@koko.com','6765655443','kikojones','Nutritionist','2015-03-27'),('o','o','o','o','o@o.com','o','o','Engineer','2015-04-07'),('Q','q','q','q','q@d.com','q','q','Psychologist','2015-04-04'),('Rafael','Tortuga Ninja','ABC 123','Sewer Avenue 123 San Juan, PR 009XX','ralph@splinter.com','787-777-7777','rafaelito','Engineer','2015-04-11'),('Alexander','Sanchez','1234567','123 pescao','sand3r@gmail.com','12345678','sand3r','Engineer','2015-03-30'),('Tainy','Collazo','12321','Urb.San Rafael','tcollazo@sabiamed.com','7873876660','tcollazo','Social Worker','2015-03-30'),('Daniel','Guzman','4325545','Urb Notre Dame Calle San Pedro K5 Caguas','guzmandaniel62@yahoo.com','787-653-7000','timeout','Nurse','2015-04-08'),('user','user','1234','user','user@user.com','user','user','Nurse','2015-03-29');
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

-- Dump completed on 2015-04-14 13:24:55
