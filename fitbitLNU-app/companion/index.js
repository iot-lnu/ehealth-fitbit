import { inbox } from "file-transfer";

// Asynchronous function to process all incoming files
async function processAllFiles() {
  let file;

  // Continuously check for new files in the inbox
  while ((file = await inbox.pop())) {
    // Read the contents of the file as text
    const payload = await file.text();

    // Send the file content using a Fetch request
    const url = "https://cscloud6-77.lnu.se/fitbit/index.php"; // Replace with the URL of your web page
    const data = `${payload}`; // Data to be sent

    // Make a POST request to the specified URL
    fetch(url, {
      method: "POST", // Use the appropriate HTTP method (GET, POST, etc.)
      body: data, // Make sure to format the data correctly
      headers: {
        "Content-Type": "text/plain", // Content type of the data
      },
    })
      .then((response) => {
        // Check if the request was successful (status code 2xx)
        if (response.ok) {
          console.log("Upload successful!");
          console.log(`File contents: ${payload}`);
        } else {
          // Log an error if the request was not successful
          console.error("Upload failed:", response.status, response.statusText);
        }
      })
      .catch((error) => {
        // Log an error if there is a problem with the request
        console.error("Error during the request:", error);
      });
  }
}

// Add an event listener to trigger the file processing function when a new file is added to the inbox
inbox.addEventListener("newfile", processAllFiles);

// Call the file processing function initially
processAllFiles();
