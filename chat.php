<?php
session_start();
include 'includes/db.php';
$my_id = $_SESSION['user_id'];
$report_id = $_GET['report_id'];

// Get report owner
$rep = $conn->query("SELECT user_id, item_name FROM reports WHERE id=$report_id")->fetch_assoc();
$owner_id = $rep['user_id'];
$receiver_id = ($my_id == $owner_id) ? $_GET['other_user'] : $owner_id; // other person

// Send message
if(isset($_POST['send'])){
    $stmt = $conn->prepare("INSERT INTO messages (report_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $report_id, $my_id, $receiver_id, $_POST['message']);
    $stmt->execute();
}

// Load messages
$msgs = $conn->query("SELECT m.*, u.name FROM messages m JOIN users u ON m.sender_id=u.id WHERE report_id=$report_id ORDER BY created_at ASC");
?>

<h3>Chat about: <?= $rep['item_name'] ?></h3>
<div style="border:1px solid #ccc; height:300px; overflow-y:scroll; padding:10px;">
<?php while($m = $msgs->fetch_assoc()): ?>
  <p><b><?= $m['name'] ?>:</b> <?= htmlspecialchars($m['message']) ?> <small><?= $m['created_at'] ?></small></p>
<?php endwhile; ?>
</div>

<form method="POST">
  <input type="text" name="message" placeholder="Type message..." required style="width:80%">
  <button name="send">Send</button>
</form>
