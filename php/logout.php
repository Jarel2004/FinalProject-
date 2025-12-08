<?php
require "config.php";

session_unset();
session_destroy();

echo "LOGOUT";
?>
