<?php
// If the HTTP request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Gets POST data from the request body
  $text = file_get_contents('php://input');

  // Formats current time for the filename
  $filename = 'data/' . date('Y-m-d_H') . '.txt';

  // Saves data to a file with the filename based on current date and time
  file_put_contents($filename, $text . PHP_EOL, FILE_APPEND);

  // Sets HTTP response status code to 200
  http_response_code(200);

  // Prints a message for the client
  echo "File saved as $filename";
  exit();
}
?>

<!-- The HTML form, replace it for your actual form -->
<form method="post">
  <textarea name="data"></textarea>
  <button type="submit">Submit</button>
</form>

<h2>Files</h2>

<?php
// Scans 'data' directory for files
$files = scandir('data');

// Iterates over the files
foreach ($files as $file) {
  // Excludes '.' and '..' from the list
  if ($file == '.' || $file == '..') continue;

  // Prints a link to download the file
  echo "<p><a href=\"data/$file\">$file</a></p>";
}

