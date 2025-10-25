<?php
include 'db.php';

if (!empty($_POST['task'])) {
    $task = $conn->real_escape_string($_POST['task']);
    $conn->query("INSERT INTO todos (task) VALUES ('$task')");
}

header("Location: index.php");
exit;
?>
