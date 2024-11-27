<?php

require_once "header.php";

class Reports{

    function numOfOwners() {

        include 'connection.php';

        $sql = "SELECT COUNT(*) as total FROM owners";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $rowCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $conn = null; 
        $stmt = null;

        return $rowCount;
    }

    function numOfSpecies() {

        include 'connection.php';

        $sql = "SELECT COUNT(*) as total FROM species";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $rowCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $conn = null; 
        $stmt = null;

        return $rowCount;
    }

    function numOfBreeds() {

        include 'connection.php';

        $sql = "SELECT COUNT(*) as total FROM breeds";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $rowCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $conn = null; 
        $stmt = null;

        return $rowCount;
    }

    function numOfPets() {

        include 'connection.php';

        $sql = "SELECT COUNT(*) as total FROM pets";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $rowCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $conn = null; 
        $stmt = null;

        return $rowCount;
    }

    function getPets() {

        include 'connection.php';

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
                    ORDER BY p.PetID DESC 
                    ";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

        unset($conn); 
        unset($stmt);
        return json_encode($returnValue);
    }

}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = isset($_GET['operation']) ? $_GET['operation'] : "";
    $json = isset($_GET['json']) ? $_GET['json'] : "";
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = isset($_POST['operation']) ? $_POST['operation'] : "";
    $json = isset($_POST['json']) ? $_POST['json'] : "";
}


$reports = new Reports();

switch($operation){
    case "numOfOwners":
        echo $reports->numOfOwners();
        break;
    case "numOfSpecies":
        echo $reports->numOfSpecies();
        break;
    case "numOfBreeds":
        echo $reports->numOfBreeds();
        break;
    case "numOfPets":
        echo $reports->numOfPets();
        break;
    case "getPets":
        echo $reports->getPets();
        break;
    default:
    echo json_encode(array("status" => "failed", "message" => "Invalid Operation"));
    break;
}

?>