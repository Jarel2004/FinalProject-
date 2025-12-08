<?php
require "config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $first = $_POST["first_name"];
    $last = $_POST["last_name"];
    $email = $_POST["email"];
    $mobile = $_POST["mobile"];
    $dob = $_POST["dob"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    // Check if email already exists
    $check = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        echo "EXISTS";
        exit;
    }

    // Insert user
    $sql = $conn->prepare("INSERT INTO users (first_name, last_name, email, password, mobile) VALUES (?, ?, ?, ?, ?)");
    $sql->bind_param("sssss", $first, $last, $email, $password, $mobile);
    $sql->execute();

    echo "SUCCESS";
}
?>
