<?php
include 'db.php';

// Ensure table exists
$conn->query("
  CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
");

// Fetch tasks
$result = $conn->query("SELECT * FROM todos ORDER BY created_at DESC");
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>📝 To-Do List</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 text-gray-800 flex items-center justify-center h-screen">
  <div class="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
    <h1 class="text-2xl font-bold mb-4 text-center">📝 To-Do List</h1>

    <form action="add.php" method="POST" class="flex mb-4">
      <input type="text" name="task" placeholder="Enter new task..." class="border flex-1 rounded-l px-3 py-2 focus:outline-none" required>
      <button type="submit" class="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600">Add</button>
    </form>

    <table class="w-full text-left border-t border-gray-200">
      <thead>
        <tr class="text-gray-600">
          <th class="py-2">Task</th>
          <th class="py-2 text-center">Status</th>
          <th class="py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
          <tr class="border-t">
            <td class="py-2 <?php echo $row['completed'] ? 'line-through text-gray-400' : ''; ?>">
              <?php echo htmlspecialchars($row['task']); ?>
            </td>
            <td class="text-center">
              <?php echo $row['completed'] ? '✅' : '⏳'; ?>
            </td>
            <td class="text-right space-x-1">
              <a href="update.php?id=<?php echo $row['id']; ?>&complete=<?php echo $row['completed'] ? 0 : 1; ?>" class="text-green-600 hover:underline">Toggle</a>
              <a href="delete.php?id=<?php echo $row['id']; ?>" class="text-red-600 hover:underline">Delete</a>
            </td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</body>
</html>
