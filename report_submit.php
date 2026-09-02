<?php
session_start();
include 'includes/db.php'; 

if(!isset($_SESSION['user_id'])){ die("Login first"); }

if(isset($_POST['submit_report'])){
    $stmt = $conn->prepare("INSERT INTO reports (user_id, type, item_name, description, location, lost_found_date, contact) VALUES (?, ?, ?)");
    $stmt->bind_param("issssss", $_SESSION['user_id'], $_POST['type'], $_POST['item_name'], $_POST['description'], $_POST['location'], $_POST['date'], $_POST['contact']);
    
    if($stmt->execute()){
        header("Location: reports.php?success=1");
        exit;
    } else {
        echo "Error: " . $conn->error;
    }
}
?>

<!DOCTYPE html>
<html>
<head><title>Report Item</title></head>
<body>
<h3>Report Lost/Found Item</h3>
<form method="POST">
  <select name="type" required>
    <option value="">Select</option>
    <option value="Lost">Lost</option>
    <option value="Found">Found</option>
  </select><br><br>
  <input type="text" name="item_name" placeholder="Item Name e.g. ID Card" required><br><br>
  <textarea name="description" placeholder="Description"></textarea><br><br>
  <input type="text" name="location" placeholder="Location e.g. Library"><br><br>
  <input type="date" name="date"><br><br>
  <input type="text" name="contact" placeholder="Your Phone/Email" required><br><br>
  <button type="submit" name="submit_report">Submit Report</button>
</form>
</body>
</html>
