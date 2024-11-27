<?php

require_once "header.php";

class User{

    function addUser($json) {
        include "connection.php";
    
        $decoded_json = json_decode($json, true);
    
        $userFname = htmlspecialchars($decoded_json["firstName"]);
        $userLname = htmlspecialchars($decoded_json["lastName"]);
        $username = htmlspecialchars($decoded_json["username"]);
        $email = htmlspecialchars($decoded_json["email"]);
        $userPword = $decoded_json["password"];
        $hashedPassword = password_hash($userPword, PASSWORD_DEFAULT);
    
        $sqlCheckUsername = "SELECT username FROM users WHERE username = :username";
        $stmtCheckUsername = $conn->prepare($sqlCheckUsername);
        $stmtCheckUsername->bindParam(":username", $username);
        $stmtCheckUsername->execute();
    
        if ($stmtCheckUsername->rowCount() > 0) {
            return json_encode(array("status" => "failed", "message" => "Username already exists. Please try another."));
        }

        $sqlCheckEmail = "SELECT email FROM users WHERE email = :email";
        $stmtCheckEmail = $conn->prepare($sqlCheckEmail);
        $stmtCheckEmail->bindParam(":email", $email);
        $stmtCheckEmail->execute();
    
        if ($stmtCheckEmail->rowCount() > 0) {
            return json_encode(array("status" => "failed", "message" => "Email already exists. Please try another."));
        }

        $uploadDir = "avatar/";
        $fileName = uniqid() . '_' . date('YmdHis') . '_' . basename($_FILES['image']['name']);
        $uploadFile = $uploadDir . $fileName;
    
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            $sqlInsertUser = "INSERT INTO users(first_name, last_name, username, email, password_hash, avatar, created_at) ";
            $sqlInsertUser .= "VALUES(:userFname, :userLname, :username, :email, :userPass, :avatar, CURRENT_TIMESTAMP())";
    
            $stmtInsertUser = $conn->prepare($sqlInsertUser);
            $stmtInsertUser->bindParam(":userFname", $userFname);
            $stmtInsertUser->bindParam(":userLname", $userLname);
            $stmtInsertUser->bindParam(":username", $username);
            $stmtInsertUser->bindParam(":email", $email);
            $stmtInsertUser->bindParam(":userPass", $hashedPassword);
            $stmtInsertUser->bindParam(":avatar", $fileName);
            $stmtInsertUser->execute();
    
            if ($stmtInsertUser->rowCount() > 0) {
                return json_encode(array("status" => "success", "message" => "User added successfully!"));
            } else {
                return json_encode(array("status" => "failed", "message" => "Error adding user. Please try again."));
            }
        } else {
            return json_encode(array("status" => "failed", "message" => "Failed to save the uploaded file."));
        }
    }
    

    function getCurrentUser($json) {
        include "connection.php";

        $decoded_json = json_decode($json, true);
    
        $userId =  $decoded_json["userId"];
            
        $sql = "SELECT user_id, first_name, last_name, username, email, avatar FROM users WHERE user_id = :userId ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":userId", $userId);
        $stmt->execute();
        
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $conn = null;
        $stmt = null;
        
        echo json_encode($userData);
    }

    function getUsers($json) {
        include "connection.php";
    
        $decoded_json = json_decode($json, true);
    
        $userId = isset($decoded_json["userId"]) ? $decoded_json["userId"] : "";

        $sql = "SELECT user_id, first_name, last_name, username, email, avatar 
                FROM users 
                WHERE user_id != :userId ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($returnValue);
        $conn = null;
    }

    function updateUser($json) {
        include "connection.php";
    
        $decoded_json = json_decode($json, true);
    
        $userFname = htmlspecialchars($decoded_json["firstName"]);
        $userLname = htmlspecialchars($decoded_json["lastName"]);
        $username = htmlspecialchars($decoded_json["username"]);
        $email = htmlspecialchars($decoded_json["email"]);
        $userId = htmlspecialchars($decoded_json["userId"]);
    
        $uploadDir = "avatar/";
        $avatarPath = null;
    
        if (!empty($_FILES['image']['name'])) {
            $fileName = uniqid() . '_' . date('YmdHis') . '_' . basename($_FILES['image']['name']);
            $uploadFile = $uploadDir . $fileName;
    
            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                $avatarPath = $fileName; 
            } else {
                return json_encode(array("status" => "failed", "message" => "Failed to save the uploaded file."));
            }
        }
    
        // Base SQL query
        $sql = "UPDATE users SET first_name = :firstName, last_name = :lastName, username = :username, email = :email";
    
        // Add avatar conditionally
        if ($avatarPath) {
            $sql .= ", avatar = :avatar";
        }
    
        $sql .= " WHERE user_id = :userId";
    
        $stmt = $conn->prepare($sql);
    
        $stmt->bindParam(':firstName', $userFname);
        $stmt->bindParam(':lastName', $userLname);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':userId', $userId);
    
        if ($avatarPath) {
            $stmt->bindParam(':avatar', $avatarPath);
        }
    
        $stmt->execute();
    
        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => "success", "message" => "User updated successfully!"));
        } else {
            return json_encode(array("status" => "failed", "message" => "Error updating user. Please try again."));
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


$systemUser = new User();

switch($operation){
    case "addUser":
        echo $systemUser->addUser($json);
        break;
    case "getCurrentUser":
        echo $systemUser->getCurrentUser($json);
        break;
    case "getUsers":
        echo $systemUser->getUsers($json);
        break;
    case "updateUser":
        echo $systemUser->updateUser($json);
        break;
}

?>