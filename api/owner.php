<?php

require_once "header.php";

class Owner{

    function addOwner($json) {

        include 'connection.php';

        $json = json_decode($json, true);

        $sql = "INSERT INTO owners(Name, ContactDetails, Address) ";
        $sql .= "VALUES (:name, :contactDetails, :address) ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $json['name']);
        $stmt->bindParam(':contactDetails', $json['contactDetails']);
        $stmt->bindParam(':address', $json['address']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => "success", "message" => "Owner added successfully!"));
        } else {
            return json_encode(array("status" => "failed", "message" => "Error adding owner. Please try again."));
        }
    }

    function getOwners() {

        include 'connection.php';

        $sql = "SELECT * FROM owners";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

        unset($conn); 
        unset($stmt);
        return json_encode($returnValue);
    }

    function updateOwner($json) {

        include 'connection.php';
        $json = json_decode($json, true);

        $sql = "UPDATE owners SET Name = :name, ContactDetails = :contactDetails, Address = :address WHERE OwnerId = :ownerId ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $json['name']);
        $stmt->bindParam(':contactDetails', $json['contactDetails']);
        $stmt->bindParam(':address', $json['address']);
        $stmt->bindParam(':ownerId', $json['ownerId']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => "success", "message" => "Owner updated successfully!"));
        } else {
            return json_encode(array("status" => "failed", "message" => "Error updating owner. Please try again."));
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


$owner = new Owner();

switch($operation){
    case "addOwner":
        echo $owner->addOwner($json);
        break;
    case "getOwners":
        echo $owner->getOwners();
        break;
    case "updateOwner":
        echo $owner->updateOwner($json);
        break;
    default:
    echo json_encode(array("status" => "failed", "message" => "Invalid Operation"));
    break;
}

?>