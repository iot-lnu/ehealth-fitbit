// Import necessary modules
import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import * as fs from "fs";
import * as document from "document";
import { Accelerometer } from "accelerometer";
import { outbox } from "file-transfer";

// Set clock granularity to "seconds" for ticking every second
clock.granularity = "seconds";

// Initialize variables for data storage
let data = "";
let newdata = "";
const myLabel = document.getElementById("myLabel"); // Reference to the label element

// File size limit before triggering file transfer
const fileSizeLimit = 5000;

// Function to collect, write, and send data when the file size limit is reached
function collectWriteAndSendData() {
  // Collect accelerometer data
  if (Accelerometer) {
    const accel = new Accelerometer({ frequency: 1 });
    accel.addEventListener("reading", () => {
      newdata = `${accel.x},${accel.y},${accel.z}`;
    });
    accel.start();
  }

  // Collect heart rate data
  if (HeartRateSensor) {
    const hrm = new HeartRateSensor({ frequency: 1 });
    hrm.addEventListener("reading", () => {
      newdata = newdata + "," + `${hrm.heartRate}`;
    });
    hrm.start();
  }

  // Write data every 5 seconds
  const currentTime = new Date().toTimeString().slice(0, -4);
  data += currentTime + "," + newdata + "\n"; // Append new data
  fs.writeFileSync("data.txt", data, "utf-8");

  // Check file size and initiate file transfer if the limit is reached
  if (data.length >= fileSizeLimit) {
    outbox
      .enqueueFile("/private/data/data.txt")
      .then(ft => {
        console.log(`Transfer of ${ft.name} successfully queued.`);
      })
      .catch(err => {
        console.log(`Failed to schedule transfer: ${err}`);
      });
    data = ""; // Reset data after sending
  }
}
// Call the function every second
setInterval(collectWriteAndSendData, 5000);
// Read file content on every clock tick event
clock.addEventListener("tick", (evt) => {
  if (fs.existsSync("data.txt")) {
    const fileContent = fs.readFileSync("data.txt", "utf-8");
    myLabel.text = fileContent.length; // Display the length of the file content on the label
  }
});
