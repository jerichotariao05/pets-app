-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 29, 2024 at 06:50 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_pets`
--

-- --------------------------------------------------------

--
-- Table structure for table `breeds`
--

CREATE TABLE `breeds` (
  `BreedID` int(11) NOT NULL,
  `BreedName` varchar(100) DEFAULT NULL,
  `SpeciesID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `breeds`
--

INSERT INTO `breeds` (`BreedID`, `BreedName`, `SpeciesID`) VALUES
(1, 'Apo Eagle', 1),
(2, 'Batanes Tamaraw', 2),
(3, 'Bubalus Carabanesis', 3),
(4, 'Leyte Tarsier', 4),
(5, 'Pinoy Cobra', 5),
(6, 'Palawan Binturong', 6),
(7, 'Sulu Dugong', 7),
(8, 'Mekong Crocodile', 8),
(9, 'Rufous-crowned Kagu', 9),
(10, 'Philippine Colugo', 10);

-- --------------------------------------------------------

--
-- Table structure for table `owners`
--

CREATE TABLE `owners` (
  `OwnerID` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `ContactDetails` varchar(100) DEFAULT NULL,
  `Address` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `owners`
--

INSERT INTO `owners` (`OwnerID`, `Name`, `ContactDetails`, `Address`) VALUES
(1, 'Gabriel Santos', '09175567890', 'Davao City, Davao del Sur'),
(2, 'Isabella Cruz', '09285567891', 'Makati City, Metro Manila'),
(3, 'Luisito Reyes', '09395567892', 'Cebu City, Cebu'),
(4, 'Sofia Mendoza', '09405567893', 'Tagaytay City, Cavite'),
(5, 'Andrei Martinez', '09515567894', 'Baguio City, Benguet'),
(6, 'Jasmine Torres', '09625567895', 'Iloilo City, Iloilo'),
(7, 'Miguel Alvarado', '09735567896', 'Cagayan de Oro City, Misamis Oriental'),
(8, 'Diana Garcia', '09845567897', 'Dumaguete City, Negros Oriental'),
(9, 'Rafael Gomez', '09955567898', 'General Santos City, South Cotabato'),
(10, 'Ella Fernandez', '09065567899', 'Zamboanga City, Zamboanga del Sur');

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `PetID` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `SpeciesID` int(11) DEFAULT NULL,
  `BreedID` int(11) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `OwnerID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`PetID`, `Name`, `SpeciesID`, `BreedID`, `DateOfBirth`, `OwnerID`) VALUES
(1, 'Eagle Eye', 1, 1, '2018-03-12', 1),
(2, 'Tamaraw Titan', 2, 2, '2019-07-23', 2),
(3, 'Carabao Champ', 3, 3, '2020-05-19', 3),
(4, 'Tarsier Trixie', 4, 4, '2021-09-30', 4),
(5, 'Cobra Kobra', 5, 5, '2018-11-14', 5),
(6, 'Bearcat Bella', 6, 6, '2019-02-17', 6),
(7, 'Dugong Dave', 7, 7, '2020-08-25', 7),
(8, 'Crocodile Carl', 8, 8, '2021-01-08', 8),
(9, 'Kagu Katie', 9, 9, '2019-12-03', 9),
(10, 'Flying Lemur Leo', 10, 10, '2020-06-11', 10);

-- --------------------------------------------------------

--
-- Table structure for table `species`
--

CREATE TABLE `species` (
  `SpeciesID` int(11) NOT NULL,
  `SpeciesName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `species`
--

INSERT INTO `species` (`SpeciesID`, `SpeciesName`) VALUES
(1, 'Philippine Eagle'),
(2, 'Tamaraw'),
(3, 'Carabao'),
(4, 'Philippine Tarsier'),
(5, 'Philippine Cobra'),
(6, 'Palawan Bearcat'),
(7, 'Dugong'),
(8, 'Philippine Crocodile'),
(9, 'Kagu'),
(10, 'Flying Lemur');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `username`, `email`, `password_hash`, `avatar`, `created_at`) VALUES
(2, 'Jane', 'Doe', 'Jane123', 'Jane123@gmail.com', '$2y$10$S85AIJiA1MVga0AiF8OAmO8NWiNU834SneHLXPJjboQS84ceB80e.', '66cf5282da975_20240828183826_avatar_2.png', '2024-08-21 15:47:38'),
(6, 'John', 'Doe', 'JDoe', 'JDoe123@gmail.com', '$2y$10$hhsMe4qBf.eceHf/rvdmfOpceThG7pwIkx0wRp4LYwt6JfUesAtQO', '66d09b76dfa74_20240829180158_avatar_1.png', '2024-08-30 00:01:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `breeds`
--
ALTER TABLE `breeds`
  ADD PRIMARY KEY (`BreedID`),
  ADD KEY `SpeciesID` (`SpeciesID`);

--
-- Indexes for table `owners`
--
ALTER TABLE `owners`
  ADD PRIMARY KEY (`OwnerID`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`PetID`),
  ADD KEY `OwnerID` (`OwnerID`),
  ADD KEY `SpeciesID` (`SpeciesID`),
  ADD KEY `BreedID` (`BreedID`);

--
-- Indexes for table `species`
--
ALTER TABLE `species`
  ADD PRIMARY KEY (`SpeciesID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `breeds`
--
ALTER TABLE `breeds`
  MODIFY `BreedID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `owners`
--
ALTER TABLE `owners`
  MODIFY `OwnerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `PetID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `species`
--
ALTER TABLE `species`
  MODIFY `SpeciesID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `breeds`
--
ALTER TABLE `breeds`
  ADD CONSTRAINT `breeds_ibfk_1` FOREIGN KEY (`SpeciesID`) REFERENCES `species` (`SpeciesID`);

--
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`OwnerID`) REFERENCES `owners` (`OwnerID`),
  ADD CONSTRAINT `pets_ibfk_2` FOREIGN KEY (`SpeciesID`) REFERENCES `species` (`SpeciesID`),
  ADD CONSTRAINT `pets_ibfk_3` FOREIGN KEY (`BreedID`) REFERENCES `breeds` (`BreedID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
