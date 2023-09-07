-- MySQL dump 10.13  Distrib 5.7.40, for Linux (x86_64)
--
-- Host: localhost    Database: ui_test
-- ------------------------------------------------------
-- Server version	5.7.40-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `TestReport`
--

DROP TABLE IF EXISTS `TestReport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TestReport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `test_event_id` int(11) DEFAULT NULL,
  `html_report` text,
  `success_rate` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `test_event_id` (`test_event_id`),
  CONSTRAINT `TestReport_ibfk_1` FOREIGN KEY (`test_event_id`) REFERENCES `testevent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TestReport`
--

LOCK TABLES `TestReport` WRITE;
/*!40000 ALTER TABLE `TestReport` DISABLE KEYS */;
INSERT INTO `TestReport` VALUES (1,3,'[\"/www/wwwroot/admin/backend/test_reports/report_3_20230830004809.html\", \"/www/wwwroot/admin/backend/test_reports/report_3_20230830004814.html\"]',0),(2,4,'[\"/www/wwwroot/admin/backend/test_reports/report_4_20230902185631.html\"]',0),(3,5,'[\"/www/wwwroot/admin/backend/test_reports/report_5_20230902193446.html\"]',0),(4,6,'[\"/www/wwwroot/admin/backend/test_reports/report_6_20230902194026.html\"]',0),(5,7,'[\"/www/wwwroot/admin/backend/test_reports/report_7_20230902194203.html\"]',0),(6,8,'[\"/www/wwwroot/admin/backend/test_reports/report_8_20230902204713.html\"]',0),(7,9,'[\"/www/wwwroot/admin/backend/test_reports/report_9_20230902205125.html\"]',0);
/*!40000 ALTER TABLE `TestReport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('not started','in process','finished') DEFAULT NULL,
  `task_list_id` int(11) DEFAULT NULL,
  `user_case_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_list_id` (`task_list_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`task_list_id`) REFERENCES `taskslist` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'1',NULL,'not started',NULL,1),(2,'1',NULL,'not started',NULL,1),(3,'1',NULL,'not started',NULL,1),(4,'1',NULL,'not started',NULL,1),(5,'1',NULL,'not started',NULL,1),(6,'1',NULL,'not started',NULL,1),(7,'1',NULL,'not started',NULL,1),(8,'1',NULL,'not started',NULL,1),(9,'1',NULL,'not started',NULL,1);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taskslist`
--

DROP TABLE IF EXISTS `taskslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taskslist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `taskslist_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskslist`
--

LOCK TABLES `taskslist` WRITE;
/*!40000 ALTER TABLE `taskslist` DISABLE KEYS */;
INSERT INTO `taskslist` VALUES (15,'1','2023-09-02 21:29:36',3);
/*!40000 ALTER TABLE `taskslist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team` (
  `team_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`team_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `team_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (1,'11','1','2023-08-29 15:57:34','2023-08-29 15:57:34',6),(2,'TEST','T','2023-08-31 18:09:17','2023-08-31 18:09:17',7),(3,'null','','2023-09-02 12:46:05','2023-09-02 12:46:05',11),(4,'1','1','2023-09-03 12:47:00','2023-09-03 12:47:00',11),(5,'Hongjin Chen','Hongjin Chen','2023-09-03 12:49:43','2023-09-03 12:49:43',11),(6,'one','work','2023-09-03 13:16:58','2023-09-03 13:16:58',12);
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testcase`
--

DROP TABLE IF EXISTS `testcase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testcase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `subtype` varchar(50) NOT NULL,
  `parameters` text,
  `test_event_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `test_event_id` (`test_event_id`),
  CONSTRAINT `testcase_ibfk_1` FOREIGN KEY (`test_event_id`) REFERENCES `testevent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testcase`
--

LOCK TABLES `testcase` WRITE;
/*!40000 ALTER TABLE `testcase` DISABLE KEYS */;
INSERT INTO `testcase` VALUES (1,'2023-08-29 16:48:08','Given','Users open the page','[{\"value\": \"https://www.bilibili.com/\", \"type\": \"URL\"}]',3),(2,'2023-09-02 10:56:31','Given','Users open the page','[{\"value\": \"https://www.zhihu.com/signin?next=%2F\", \"type\": \"URL\"}]',4),(3,'2023-09-02 11:34:46','Given','Users open the page','[{\"value\": \"https://www.zhihu.com/signin?next=%2F\", \"type\": \"URL\"}]',5),(4,'2023-09-02 11:40:26','Given','Users open the page','[{\"value\": \"https://www.zhihu.com/signin?next=%2F\", \"type\": \"URL\"}]',6),(5,'2023-09-02 11:42:03','Given','Users open the page','[{\"value\": \"https://www.zhihu.com/signin?next=%2F\", \"type\": \"URL\"}]',7),(6,'2023-09-02 12:51:26','Given','Users open the page','[{\"value\": \"1\", \"type\": \"URL\"}]',9);
/*!40000 ALTER TABLE `testcase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testcaseelement`
--

DROP TABLE IF EXISTS `testcaseelement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testcaseelement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `story_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `subtype` varchar(50) NOT NULL,
  `parameters` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testcaseelement`
--

LOCK TABLES `testcaseelement` WRITE;
/*!40000 ALTER TABLE `testcaseelement` DISABLE KEYS */;
INSERT INTO `testcaseelement` VALUES (1,2,'When','User input data','[{\"textValue\": \"123456789\", \"value\": \"SignFlowInput-errorMask undefined SignFlowInput-requiredErrorMask\", \"type\": \"Class Name\"}]'),(2,2,'When','User input data','[{\"value\": \"Input i7cW1UcwT6ThdhTakqFm username-input\", \"type\": \"Class Name\", \"textValue\": \"123456789\"}]'),(3,6,'When','User input data','[{\"value\": \"\", \"type\": \"\"}]'),(4,6,'Then','The user is now on this page','[{\"value\": \"\", \"type\": \"\"}]');
/*!40000 ALTER TABLE `testcaseelement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testevent`
--

DROP TABLE IF EXISTS `testevent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testevent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `environment` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `state` enum('Finished','In process') DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `testevent_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `testevent_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testevent`
--

LOCK TABLES `testevent` WRITE;
/*!40000 ALTER TABLE `testevent` DISABLE KEYS */;
INSERT INTO `testevent` VALUES (3,'run','2023-08-29 16:48:08',6,'[\"chrome\", \"edge\"]','','Finished',1),(4,'run','2023-09-02 10:56:31',7,'[\"chrome\"]','','Finished',2),(5,'run','2023-09-02 11:34:46',7,'[\"chrome\"]','','Finished',2),(6,'测试','2023-09-02 11:40:26',7,'[\"chrome\"]','','Finished',2),(7,'1','2023-09-02 11:42:03',7,'[\"chrome\"]','','Finished',2),(8,'1','2023-09-02 12:47:13',11,'[\"chrome\"]','1','Finished',3),(9,'1','2023-09-02 12:51:26',11,'[\"edge\"]','','Finished',3);
/*!40000 ALTER TABLE `testevent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `password` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `avatar_link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'tester_holly','pbkdf2:sha256:260000$lzf3DNPTtDuyi8LU$0daf2ca7e7c3812339a54e55c034a7d2d75e4496ab06e901f5525cc8c75e4770','aruix@outlook.com',NULL,NULL),(5,'http://localhost/','pbkdf2:sha256:260000$Edpk3ktge7uO9Tpu$bc0c32d9ac05b723d44a22c40077757a5766084b766815a488fbb670e5e07d1f','Hongjin.Chen@warwick.ac.uk',NULL,NULL),(6,'Hongjin Chen','pbkdf2:sha256:260000$wlKXIHbFL7a85dgL$cc3fa0c1d67ce3b58d267d3a54b67a23542211cbc7d53274aaebe07e2273546b','hongjin.chen18@student.xjtlu.edu.cn',NULL,NULL),(7,'Shiyu Chen','pbkdf2:sha256:260000$7msLMJuFXRPtJnlR$a28abe189adc9fd5698f6ea649c19c6ebb04afa942c2ec72a4323e19565e5fdc','775363056@qq.com',NULL,NULL),(8,'MLitester','pbkdf2:sha256:260000$KH3qRi2ocZZ3i4mI$11a5f71bc961d167c10b6ef916d9d0812a81e28945ba37661440d2a4a17bca23','muyangli@163.cc',NULL,NULL),(9,'null','pbkdf2:sha256:260000$9DlYyDc6ncrXKh8s$127ce974fc6bb4dfac444ad2db83c90750fc94d2055b397054b65e8e14d01b7c','2496677317@qq.com',NULL,NULL),(10,'Boning Yang','pbkdf2:sha256:260000$8RRmVyAOZzRnu3nL$eec7ca6a8f3c789504dc2ad29d3922adf3498aaf07148806ac28c43f1dd5e360','349300733@qq.com',NULL,NULL),(11,'7753630561@qq.com','pbkdf2:sha256:260000$khYP02l4pudrfVIq$fcba53a5c4c551f73ce7071425f31c550f340e610fca16a21c6b5d133a34e647','7753630561@qq.com',NULL,NULL),(12,'fish','pbkdf2:sha256:260000$LtDG2Pn0r5mZB2OB$cba9666dabc598c5f3c0184019021e2eb18a6aec91de23c6a7069e7b9a972319','343860442@qq.com',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercontribution`
--

DROP TABLE IF EXISTS `usercontribution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usercontribution` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `activity_period` varchar(10) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `usercontribution_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercontribution`
--

LOCK TABLES `usercontribution` WRITE;
/*!40000 ALTER TABLE `usercontribution` DISABLE KEYS */;
INSERT INTO `usercontribution` VALUES (1,6,'2023-08',1),(2,7,'2023-09',4),(3,11,'2023-09',2);
/*!40000 ALTER TABLE `usercontribution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userteam`
--

DROP TABLE IF EXISTS `userteam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userteam` (
  `team_member_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `joined_at` datetime DEFAULT NULL,
  PRIMARY KEY (`team_member_id`),
  KEY `user_id` (`user_id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `userteam_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `userteam_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userteam`
--

LOCK TABLES `userteam` WRITE;
/*!40000 ALTER TABLE `userteam` DISABLE KEYS */;
INSERT INTO `userteam` VALUES (1,6,1,'manager','2023-08-29 15:57:34'),(2,6,1,'member','2023-08-29 15:57:34'),(3,7,2,'manager','2023-08-31 18:09:17'),(4,6,2,'member','2023-08-31 18:09:17'),(5,1,2,NULL,'2023-08-31 18:09:46'),(6,11,3,'manager','2023-09-02 12:46:05'),(7,6,3,'member','2023-09-02 12:46:05'),(8,1,3,'member','2023-09-02 12:46:05'),(9,5,3,'member','2023-09-02 12:46:05'),(10,9,3,NULL,'2023-09-02 12:58:19'),(11,11,4,'manager','2023-09-03 12:47:00'),(12,11,4,'member','2023-09-03 12:47:00'),(13,11,5,'manager','2023-09-03 12:49:43'),(14,11,5,'member','2023-09-03 12:49:43'),(15,12,6,'manager','2023-09-03 13:16:58'),(16,12,6,'member','2023-09-03 13:16:58');
/*!40000 ALTER TABLE `userteam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ui_test'
--

--
-- Dumping routines for database 'ui_test'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-07 11:17:27
