<?php

require_once "header.php";

class Breed{

    function addBreed($json) {

        include 'connection.php';

        $json = json_decode($json, true);

        $sql = "INSERT INTO breeds(BreedName, SpeciesId) ";
        $sql .= "VALUES (:name, :specieId) ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $json['name']);
        $stmt->bindParam(':specieId', $json['specieId']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => "success", "message" => "Breed added successfully!"));
        } else {
            return json_encode(array("status" => "failed", "message" => "Error adding breed. Please try again."));
        }
    }

    function getBreeds() {

        include 'connection.php';

        $sql = "SELECT b.BreedID , b.BreedName, b.SpeciesID, s.SpeciesName FROM breeds b ";
        $sql .= "INNER JOIN species s ON b.SpeciesID = s.SpeciesID ";
        $sql .= "ORDER BY b.BreedID ";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

        unset($conn); 
        unset($stmt);
        return json_encode($returnValue);
    }

    function getSpecieBreeds($json) {
        include 'connection.php';
    
        $decoded_json = json_decode($json, true);
        $speciesId = isset($decoded_json["speciesId"]) ? $decoded_json["speciesId"] : "";
    
        try {
            $sql = "SELECT b.BreedID, b.BreedName, b.SpeciesID, s.SpeciesName FROM breeds b ";
            $sql .= "INNER JOIN species s ON b.SpeciesID = s.SpeciesID ";
            $sql .= "WHERE b.SpeciesID = :speciesId ";
            $sql .= "ORDER BY b.BreedID";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":speciesId", $speciesId, PDO::PARAM_INT);
            $stmt->execute();
            
            $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($returnValue);
        } catch (PDOException $e) {
            return json_encode(['error' => 'Database query failed', 'message' => $e->getMessage()]);
        } finally {
            unset($conn); 
            unset($stmt);
        }
    }
    

    function updateBreed($json) {

        include 'connection.php';
        $json = json_decode($json, true);

        $sql = "UPDATE breeds SET BreedName = :name, SpeciesID = :specieId WHERE BreedID = :breedId ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $json['name']);
        $stmt->bindParam(':specieId', $json['specieId']);
        $stmt->bindParam(':breedId', $json['breedId']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => "success", "message" => "Breed updated successfully!"));
        } else {
            return json_encode(array("status" => "failed", "message" => "Error updating Breed. Please try again."));
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


$breed = new Breed();

switch($operation){
    case "addBreed":
        echo $breed->addBreed($json);
        break;
    case "getBreeds":
        echo $breed->getBreeds();
        break;
    case "getSpecieBreeds":
        echo $breed->getSpecieBreeds($json);
        break;
    case "updateBreed":
        echo $breed->updateBreed($json);
        break;
    default:
    echo json_encode(array("status" => "failed", "message" => "Invalid Operation"));
    break;
}

?>