-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: sw12
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bisai`
--

DROP TABLE IF EXISTS `bisai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bisai` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `isFan` tinyint(1) NOT NULL,
  `isCold` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否着凉',
  `isSelf` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否自慰',
  `isSpray` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否喷药',
  `moodDegree` decimal(3,1) NOT NULL COMMENT '心情愉悦程度',
  `bisaiDegree` decimal(3,1) NOT NULL COMMENT '鼻塞程度',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  PRIMARY KEY (`id`),
  CONSTRAINT `bisai_chk_1` CHECK ((`moodDegree` between 1 and 10)),
  CONSTRAINT `bisai_chk_2` CHECK ((`bisaiDegree` between 1 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bisai`
--

LOCK TABLES `bisai` WRITE;
/*!40000 ALTER TABLE `bisai` DISABLE KEYS */;
INSERT INTO `bisai` VALUES (1,1,0,0,1,9.0,2.0,'2026-06-07 06:26:58'),(2,1,0,0,0,7.0,8.0,'2026-06-07 08:12:40'),(3,1,1,0,0,8.0,8.0,'2026-06-07 08:12:41'),(4,1,1,0,0,6.0,2.0,'2026-06-07 08:12:41'),(5,1,0,0,0,7.0,1.0,'2026-06-07 08:12:42'),(6,1,0,0,0,4.0,2.0,'2026-06-07 08:12:42'),(7,1,0,0,0,7.0,3.0,'2026-06-07 08:12:44'),(8,1,1,0,0,5.0,4.0,'2026-06-07 08:12:45'),(9,1,0,0,0,6.0,5.0,'2026-06-07 08:12:46'),(10,1,1,0,0,7.0,6.0,'2026-06-07 08:12:47'),(11,1,0,0,0,7.0,2.0,'2026-06-07 08:12:48'),(12,1,0,0,0,6.0,8.0,'2026-06-07 08:12:49'),(13,1,0,0,0,7.0,9.0,'2026-06-07 08:12:50');
/*!40000 ALTER TABLE `bisai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'sw12'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-08 17:30:12
