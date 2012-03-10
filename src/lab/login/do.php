<?php
  $username = strtolower(trim($_POST['username']));
  $password = $_POST['password'];
  
  if (($username == 'james') && ($password == 'password')) {
    session_start();
    
    $_SESSION['username'] = $username;
    $_SESSION['fullname'] = 'James Cox';

    header("Location: ../");
  } else {
    header("Location: ./");
  }
?>
