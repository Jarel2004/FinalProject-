<?php
// File: signup.php
require_once 'includes/config.php';

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karu-mata - Sign Up</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .signup-container {
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
            background: linear-gradient(to bottom right, #d32f2f, #b71c1c);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 30px;
        }

        .logo h1 {
            font-size: 2.5rem;
            font-weight: 700;
        }

        .logo i {
            font-size: 3rem;
        }

        .left-section h2 {
            font-size: 2.2rem;
            margin-bottom: 20px;
        }

        .left-section p {
            font-size: 1.1rem;
            line-height: 1.6;
            opacity: 0.9;
        }

        .terms {
            margin-top: 30px;
            font-size: 0.9rem;
            opacity: 0.8;
        }

        .terms a {
            color: white;
            text-decoration: underline;
        }

        .right-section {
            padding: 60px 50px;
            background: #ffffff;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
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

        input, select {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #d32f2f;
        }

        .error-message {
            color: #d32f2f;
            font-size: 14px;
            margin-top: 5px;
            display: none;
        }

        .btn {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
            margin-top: 10px;
        }

        .btn-primary {
            background: #d32f2f;
            color: white;
        }

        .btn-primary:hover {
            background: #b71c1c;
        }

        .btn-secondary {
            background: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
        }

        .btn-secondary:hover {
            background: #e0e0e0;
        }

        .form-footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
        }

        .form-footer a {
            color: #d32f2f;
            text-decoration: none;
            font-weight: 500;
        }

        .form-footer a:hover {
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            .signup-container {
                grid-template-columns: 1fr;
            }
            
            .left-section {
                padding: 40px 30px;
            }
            
            .right-section {
                padding: 40px 30px;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="signup-container">
        <div class="left-section">
            <div class="logo">
                <i class="fas fa-utensils"></i>
                <h1>Karu-mata</h1>
            </div>
            <h2>Join Karu-mata</h2>
            <p>Create an account to order your favorite Korean dishes, track deliveries, and enjoy exclusive member benefits.</p>
            <div class="terms">
                By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>
        
        <div class="right-section">
            <h2 style="color: #333; margin-bottom: 30px; font-size: 1.8rem;">Create Your Account</h2>
            
            <form id="signupForm" action="process/signup-process.php" method="POST">
                <div class="form-row">
                    <div class="form-group">
                        <label for="first_name">First Name <span class="required">*</span></label>
                        <input type="text" id="first_name" name="first_name" placeholder="Enter your first name" required>
                        <div class="error-message" id="firstNameError"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="last_name">Last Name <span class="required">*</span></label>
                        <input type="text" id="last_name" name="last_name" placeholder="Enter your last name" required>
                        <div class="error-message" id="lastNameError"></div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address <span class="required">*</span></label>
                    <input type="email" id="email" name="email" placeholder="Enter your email" required>
                    <div class="error-message" id="emailError"></div>
                </div>
                
                <div class="form-group">
                    <label for="phone">Phone Number <span class="required">*</span></label>
                    <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required>
                    <div class="error-message" id="phoneError"></div>
                </div>
                
                <div class="form-group">
                    <label for="password">Password <span class="required">*</span></label>
                    <input type="password" id="password" name="password" placeholder="Create a password (min. 6 characters)" required>
                    <div class="error-message" id="passwordError"></div>
                </div>
                
                <div class="form-group">
                    <label for="confirm_password">Confirm Password <span class="required">*</span></label>
                    <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm your password" required>
                    <div class="error-message" id="confirmPasswordError"></div>
                </div>
                
                <button type="submit" class="btn btn-primary">Create Account</button>
                
                <div class="form-footer">
                    <p>Already have an account? <a href="login.php">Sign in here</a></p>
                </div>
            </form>
            
            <?php if (isset($_GET['error'])): ?>
                <div style="background: #ffe6e6; color: #d32f2f; padding: 10px; border-radius: 5px; margin-top: 20px; text-align: center;">
                    <?php echo htmlspecialchars($_GET['error']); ?>
                </div>
            <?php endif; ?>
            
            <?php if (isset($_GET['success'])): ?>
                <div style="background: #e6ffe6; color: #2e7d32; padding: 10px; border-radius: 5px; margin-top: 20px; text-align: center;">
                    <?php echo htmlspecialchars($_GET['success']); ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script>
        const form = document.getElementById('signupForm');
        const firstName = document.getElementById('first_name');
        const lastName = document.getElementById('last_name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm_password');

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function validatePhone(phone) {
            return /^[0-9]{10,11}$/.test(phone);
        }

        form.addEventListener('submit', (e) => {
            let valid = true;
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
            });
            
            // Validate first name
            if (!firstName.value.trim()) {
                document.getElementById('firstNameError').textContent = 'First name is required';
                document.getElementById('firstNameError').style.display = 'block';
                valid = false;
            }
            
            // Validate last name
            if (!lastName.value.trim()) {
                document.getElementById('lastNameError').textContent = 'Last name is required';