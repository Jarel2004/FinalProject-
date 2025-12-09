<?php
require "php/config.php";

if (isset($_SESSION["user_id"])) {
    header("Location: index.php");
    exit();
}

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    $stmt = $conn->prepare("SELECT user_id, first_name, last_name, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $first_name, $last_name, $emailDB, $hashedPass);
        $stmt->fetch();

        if (password_verify($password, $hashedPass)) {
            $_SESSION["user_id"] = $id;
            $_SESSION["user_name"] = $first_name . " " . $last_name;
            $_SESSION["user_email"] = $emailDB;

            header("Location: index.php");
            exit();
        } else {
            $error = "Incorrect password.";
        }
    } else {
        $error = "Account not found.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Karu-mata - Log in</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, sans-serif;
        background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        padding: 60px;
        max-width: 900px;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: center;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 40px;
      }

      .logo-text {
        color: #d32f2f;
        font-size: 32px;
        font-weight: 700;
      }

      .logo-icon {
        width: 45px;
        height: 45px;
        background: #d32f2f;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
      }

      .logo-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      h1 {
        font-size: 36px;
        color: #333;
        margin-bottom: 20px;
      }

      .subtitle {
        color: #666;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 30px;
      }

      .terms {
        color: #666;
        font-size: 14px;
        line-height: 1.6;
        margin-top: 30px;
      }

      .terms a {
        color: #d32f2f;
        text-decoration: none;
        font-weight: 500;
      }

      .terms a:hover {
        text-decoration: underline;
      }

      .form-group {
        margin-bottom: 30px;
      }

      label {
        display: block;
        color: #333;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      label .required {
        color: #d32f2f;
      }

      input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s;
        background: white;
      }

      input:focus {
        outline: none;
        border-color: #d32f2f;
      }

      input::placeholder {
        color: #999;
      }

      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
      }

      .create-account-btn {
        background: none;
        border: none;
        color: #d32f2f;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
      }

      .create-account-btn:hover {
        text-decoration: underline;
      }

      .login-btn {
        background: #d32f2f;
        color: white;
        border: none;
        padding: 14px 40px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s, transform 0.1s;
      }

      .login-btn:hover {
        background: #d32f2f;
      }

      .login-btn:active {
        transform: scale(0.98);
      }

      .login-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .error {
        border-color: #d32f2f !important;
      }

      .error-message {
        color: #d32f2f;
        font-size: 12px;
        margin-top: 4px;
        display: none;
      }

      @media (max-width: 768px) {
        .container {
          grid-template-columns: 1fr;
          padding: 40px 30px;
          gap: 40px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left-section">
        <div class="logo">
          <span class="logo-text">Karu-mata</span>
          <div class="logo-icon"><img src="src/karumata.png" alt="Logo" /></div>
        </div>

        <h1>Log in</h1>

        <p class="subtitle">
          A one-time password (OTP) will be sent to your email to verify your
          identity.
        </p>

        <div class="terms">
          By continuing you agree to our <a href="#">Terms & Conditions</a> and
          <a href="#">Privacy Notice</a>
        </div>
      </div>

      <div class="right-section">
        <form id="loginForm">
          <div class="form-group">
            <label>Email<span class="required">*</span></label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
            <div class="error-message" id="emailError">
              Please enter a valid email address
            </div>
          </div>

          <div class="actions">
            <button
              type="button"
              class="create-account-btn"
              id="createAccountBtn"
            >
              Create Account
            </button>
            <button type="submit" class="login-btn">Log in</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      const form = document.getElementById("loginForm");
      const email = document.getElementById("email");
      const emailError = document.getElementById("emailError");
      const createAccountBtn = document.getElementById("createAccountBtn");

      function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateEmail(email.value)) {
          emailError.style.display = "block";
          return;
        }

        let data = new FormData();
        data.append("email", email.value);
        data.append("password", "default"); // You can add password later

        fetch("php/login.php", {
          method: "POST",
          body: data,
        })
          .then((res) => res.text())
          .then((response) => {
            if (response === "SUCCESS") {
              window.location.href = "index.php";
            } else {
              alert("Login failed. Try again.");
            }
          });
      });

      createAccountBtn.addEventListener("click", () => {
        window.location.href = "sign-up.php";
      });
    </script>
  </body>
</html>
