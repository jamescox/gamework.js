<?php session_start(); ?>
<?php include('includes/header.php'); ?>
  <?php if (!empty($_SESSION['username'])) { ?>
    <p>Welcome, <?php echo $_SESSION['fullname']; ?></p>
  <?php } else {
    header('Location: ./login'); exit();
  } ?>
<?php include('includes/footer.php'); ?>
