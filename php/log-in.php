// FINALPROJECT/php/login_handler.php (for AJAX login if needed)
<?php
require "config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $sql = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $sql->bind_param("s", $email);
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows === 0) {
        echo "NOUSER";
        exit;
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user["password"])) {
        echo "WRONGPASS";
        exit;
    }

    $_SESSION["user_id"] = $user["user_id"];
    $_SESSION["user_name"] = $user["first_name"] . " " . $user["last_name"];
    $_SESSION["user_email"] = $user["email"];

    echo "SUCCESS";
}
?>