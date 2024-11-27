<?php

require_once "header.php";

class Pet{

    function addPet($json) {

        include 'connection.php';

        $json = json_decode($json, true);

        $sql = "INSERT INTO pets(Name, SpeciesID, BreedID, DateOfBirth, OwnerID) ";
        $sql .= "VALUES (:petName, :specieId, :breedId, :dateOfBith, :ownerId) ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':petName', $json['petName']);
        $stmt->bindParam(':specieId', $json['specieId']);
        $stmt->bindParam(':breedId', $json['breedId']);
        $stmt->bindParam(':dateOfBith', $json['dateOfBirth']);
        $stmt->bindParam(':ownerId', $json['ownerId']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => "success", "message" => "Pet added successfully!"));
        } else {
            return json_encode(array("status" => "failed", "message" => "Error adding pet. Please try again."));
        }

    }

    function getPetsInfo($json) {
        include "connection.php";
    
        $decoded_json = json_decode($json, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(['error' => 'Invalid JSON input']);
            return;
        }
    
        $response = array();
        
        if (isset($decoded_json["speciesId"]) && $decoded_json["speciesId"] !== null) {
            $speciesId = $decoded_json["speciesId"];
    
            $sql = "SELECT 
                        p.PetID,
                        p.Name AS PetName,
                        s.SpeciesID,
                        s.SpeciesName,
                        b.BreedID,
                        b.BreedName,
                        p.DateOfBirth,
                        o.OwnerID,
                        o.Name AS OwnerName
                    FROM 
                        pets p
                    INNER JOIN 
                        species s ON p.SpeciesID = s.SpeciesID
                    INNER JOIN 
                        breeds b ON p.BreedID = b.BreedID
                    INNER JOIN 
                        owners o ON p.OwnerID = o.OwnerID
                    WHERE s.SpeciesID = :speciesId ";
    
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':speciesId', $speciesId, PDO::PARAM_INT);
            
        } else {
            $sql = "SELECT 
                        p.PetID,
                        p.Name AS PetName,
                        s.SpeciesID,
                        s.SpeciesName,
                        b.BreedID,
                        b.BreedName,
                        p.DateOfBirth,
                        o.OwnerID,
                        o.Name AS OwnerName
                    FROM 
                        pets p
                    INNER JOIN 
                        species s ON p.SpeciesID = s.SpeciesID
                    INNER JOIN 
                        breeds b ON p.BreedID = b.BreedID
                    INNER JOIN 
                        owners o ON p.OwnerID = o.OwnerID
                    ORDER BY p.PetID DESC ";
            $stmt = $conn->prepare($sql);
        }
        
        if ($stmt->execute()) {
            $petsInfo = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response['petsInfo'] = $petsInfo;
        } else {
            $response['error'] = 'Failed to retrieve data from the database';
        }
    
        echo json_encode($response);
    }
    
    function updatePet($json) {

        include 'connection.php';
        $json = json_decode($json, true);

        $sql = "UPDATE pets SET Name = :petName, SpeciesID = :specieId, BreedID = :breedId, DateOfBirth = :dateOfBirth, OwnerID = :ownerId ";
        $sql .= "WHERE PetID = :petId ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':petName', $json['petName']);
        $stmt->bindParam(':specieId', $json['specieId']);
        $stmt->bindParam(':breedId', $json['breedId']);
        $stmt->bindParam(':dateOfBirth', $json['dateOfBirth']);
        $stmt->bindParam(':ownerId', $json['ownerId']);
        $stmt->bindParam(':petId', $json['petId']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => "success", "message" => "Pet updated successfully!"));
        } else {
            return json_encode(array("status" => "failed", "message" => "Error updating pet. Please try again."));
        }

    }

}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = isset($_GET['operation']) ? $_GET['operation'] : "";
    $json = isset($_GET['json']) ? $_GET['json'] : "";
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = isset($_POST['operation']) ? $_POST['operation'] : "";
    $json = isset($_POST['json']) ? $_POST['json'] : "";
}


$pet = new Pet();

switch($operation){
    case "addPet":
        echo $pet->addPet($json);
        break;
    case "getPetsInfo":
        echo $pet->getPetsInfo($json);
        break;
    case "updatePet":
        echo $pet->updatePet($json);
        break;
}

?>