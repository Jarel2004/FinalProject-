<?php
require "php/config.php";

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $fullname = trim($_POST["fullname"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    // Check if email already exists
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $error = "Email is already registered.";
    } else {
        // Hash the password
        $hashedPass = password_hash($password, PASSWORD_DEFAULT);

        // Insert account
        $stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $fullname, $email, $hashedPass);

        if ($stmt->execute()) {
            // Auto login
            $_SESSION["user_id"] = $stmt->insert_id;
            $_SESSION["user_name"] = $fullname;
            $_SESSION["user_email"] = $email;

            header("Location: index.php");
            exit();
        } else {
            $error = "Registration failed.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Karu-mata - Sign Up</title>
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
        display: grid;
        grid-template-columns: 1fr 1fr;
        max-width: 1100px;
        width: 100%;
        overflow: hidden;
      }

      .left-section {
        padding: 60px 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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

      .welcome-text {
        color: #666;
        font-size: 16px;
        line-height: 1.5;
      }

      .welcome-text a {
        color: #d32f2f;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
      }

      .welcome-text a:hover {
        text-decoration: underline;
      }

      .terms {
        color: #666;
        font-size: 14px;
        line-height: 1.6;
        margin-top: auto;
      }

      .terms a {
        color: #d32f2f;
        text-decoration: none;
        font-weight: 500;
      }

      .terms a:hover {
        text-decoration: underline;
      }

      .right-section {
        padding: 60px 50px;
        background: #fafafa;
      }

      .form-group {
        margin-bottom: 24px;
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

      input,
      select {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s;
        background: white;
      }

      input:focus,
      select:focus {
        outline: none;
        border-color: #d32f2f;
      }

      input::placeholder {
        color: #999;
      }

      .date-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .phone-input {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .phone-flag {
        font-size: 20px;
      }

      .phone-code {
        color: #666;
        font-weight: 500;
      }

      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
      }

      .log-in-btn {
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

      .log-in-btn:hover {
        text-decoration: underline;
      }

      .log-in-btn::before {
        content: "→";
        transform: rotate(180deg);
        display: inline-block;
      }

      .create-btn {
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

      .create-btn:hover {
        background: #b71c1c;
      }

      .create-btn:active {
        transform: scale(0.98);
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
        }

        .left-section {
          padding: 40px 30px;
        }

        .right-section {
          padding: 40px 30px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left-section">
        <div>
          <div class="logo">
            <span class="logo-text">Karu-mata</span>
            <div class="logo-icon">
              <img src="src/karumata.png" alt="Logo" />
            </div>
          </div>

          <h1>Register</h1>

          <p class="welcome-text">
            Welcome to <strong>Karumata!</strong>
            <a href="#" id="loginLink">Log in</a> or register an account for the
            jolliest ordering experience!
          </p>
        </div>

        <div class="terms">
          By continuing you agree to our <a href="#">Terms & Conditions</a> and
          <a href="#">Privacy Notice</a>
        </div>
      </div>

      <div class="right-section">
        <form id="registerForm">
          <div class="form-group">
            <label>First Name<span class="required">*</span></label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter your First Name"
              required
            />
            <div class="error-message" id="firstNameError">
              Please enter your first name
            </div>
          </div>

          <div class="form-group">
            <label>Last Name<span class="required">*</span></label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter your Last Name"
              required
            />
            <div class="error-message" id="lastNameError">
              Please enter your last name
            </div>
          </div>

          <div class="form-group">
            <label>Date of Birth<span class="required">*</span></label>
            <div class="date-group">
              <select id="month" required>
                <option value="">Month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              <select id="day" required>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
              </select>
            </div>
            <div class="error-message" id="dobError">
              Please select your date of birth
            </div>
          </div>

          <div class="form-group">
            <label>Mobile Number<span class="required">*</span></label>
            <div class="phone-input">
              <span class="phone-flag">🇵🇭</span>
              <span class="phone-code">+63</span>
              <input
                type="tel"
                id="mobile"
                placeholder=""
                pattern="[0-9]{10}"
                maxlength="10"
                required
              />
            </div>
            <div class="error-message" id="mobileError">
              Please enter a valid 10-digit mobile number
            </div>
          </div>

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
            <button type="button" class="log-in-btn" id="loginBtn">
              Log in
            </button>
            <button type="submit" class="create-btn">Create Account</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        let data = new FormData();
        data.append("first_name", firstName.value);
        data.append("last_name", lastName.value);
        data.append("email", email.value);
        data.append("mobile", mobile.value);
        data.append("dob", `${month.value}-${day.value}`);
        data.append("password", "default"); // until you add password field

        fetch("php/register.php", {
          method: "POST",
          body: data,
        })
          .then((res) => res.text())
          .then((result) => {
            if (result === "SUCCESS") {
              window.location.href = "log-in.php";
            } else if (result === "EXISTS") {
              alert("This email is already registered.");
            }
          });
      });
    </script>
  </body>
</html>
