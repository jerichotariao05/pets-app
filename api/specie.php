<?php

require_once "header.php";

class Specie{

    function addSpecie($json) {

        include 'connection.php';

        $json = json_decode($json, true);

        $sql = "INSERT INTO species(SpeciesName) ";
        $sql .= "VALUES (:name) ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $json['name']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => "success", "message" => "Specie added successfully!"));
        } else {
            return json_encode(array("status" => "failed", "message" => "Error adding Specie. Please try again."));
        }
    }

    function getSpecies() {

        include 'connection.php';

        $sql = "SELECT * FROM species ";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

        unset($conn); 
        unset($stmt);
        return json_encode($returnValue);
    }

    function updateSpecie($json) {

        include 'connection.php';
        $json = json_decode($json, true);

        $sql = "UPDATE species SET SpeciesName = :name WHERE SpeciesID = :specieId ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $json['name']);
        $stmt->bindParam(':specieId', $json['specieId']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => "success", "message" => "Specie updated successfully!"));
        } else {
            return json_encode(array("status" => "failed", "message" => "Error updating Specie. Please try again."));
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


$specie = new Specie();

switch($operation){
    case "addSpecie":
        echo $specie->addSpecie($json);
        break;
    case "getSpecies":
        echo $specie->getSpecies();
        break;
    case "updateSpecie":
        echo $specie->updateSpecie($json);
        break;
    default:
    echo json_encode(array("status" => "failed", "message" => "Invalid Operation"));
    break;
}

?>