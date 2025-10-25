<?php
include 'db.php';

if (isset($_GET['id']) && isset($_GET['complete'])) {
    $id = (int) $_GET['id'];
    $complete = (int) $_GET['complete'];
    $conn->query("UPDATE todos SET completed = $complete WHERE id = $id");
}

header("Location: index.php");
exit;
?>
