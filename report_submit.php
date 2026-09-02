<?php
session_start();
include 'includes/db.php'; // change path to your db connection

if(!isset($_SESSION['user_id'])){ die("Login first"); }

if(isset($_POST['submit_report'])){
    $stmt = $conn->prepare("INSERT INTO reports (user_id, type, item_name, description, location, lost_found_date, contact) VALUES (?, ?, ?)");
    $stmt->bind_param("issssss", $_SESSION['user_id'], $_POST['type'], $_POST['item_name'], $_POST['description'], $_POST['location'], $_POST['date'], $_POST['contact']);
    
    if($stmt->execute()){
        header("Location: reports.php?success=1");
    } else {
        echo "Error: " . $conn->error;
    }
}
?>

<!-- PASTE THIS FORM WHERE USERS SUBMIT LOST/FOUND -->
<form method="POST">
  <h3>Report Lost/Found Item</h3>
  <select name="type" required>
    <option value="Lost">Lost</option>
    <option value="Found">Found</option>
  </select>
  <input type="text" name="item_name" placeholder="Item Name e.g. ID Card" required>
  <textarea name="description" placeholder="Description"></textarea>
  <input type="text" name="location" placeholder="Location e.g. Library">
  <input type="date" name="date">
  <input type="text" name="contact" placeholder="Your Phone/Email" required>
  <button type="submit" name="submit_report">Submit Report</button>
</form>
