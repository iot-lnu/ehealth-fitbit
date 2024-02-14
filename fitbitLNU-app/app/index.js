// Import necessary modules
import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import * as fs from "fs";
import * as document from "document";
import { Accelerometer } from "accelerometer";
import { outbox } from "file-transfer";
import { me as device } from "device";

// Set clock granularity to "seconds" for ticking every second
clock.granularity = "seconds";

// Initialize variables for data storage
let data = "";
let newdata = "";
const myLabel = document.getElementById("myLabel"); // Reference to the label element

// File size limit before triggering file transfer
// For 20 minutes reading with 5 seconds interval you have about 240 times * ~50 bytes = 12000 bytes fileSizeLimit 
const fileSizeLimit = 2000;
const readInterval = 5000;
const filename = "data.txt";

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

  const currentTime = new Date().toTimeString().slice(0, -4);

  // Write data to file
  data += currentTime + "," + newdata + "\n";
  console.log("Length of data:", data.length);

  // Actually write the data
  fs.writeFileSync(filename, data, "utf-8");


  // Check file size and initiate file transfer if the limit is reached
  if (data.length >= fileSizeLimit) {
    sendData();
  }
}

function sendData() {
  outbox
    .enqueueFile("/private/data/data.txt")
    .then(ft => {
      console.log(`Transfer of ${ft.name} successfully queued.`);
    })
    .catch(err => {
      console.log(`Failed to schedule transfer: ${err}`);
    });
  data = "";
}

// Append previous collected data
console.log("If there is a file, load data");
if (fs.existsSync("data.txt")) {
  data += fs.readFileSync("data.txt", "utf-8");
}

console.log(`Model ID:         ${device.modelId}`);

// Enter the loop
setInterval(collectWriteAndSendData, readInterval);

// Read file content on every clock tick event
clock.addEventListener("tick", (evt) => {
  if (fs.existsSync("data.txt")) {
    const fileContent = fs.readFileSync("data.txt", "utf-8");
    myLabel.text = fileContent.length + " bytes"; // Display the length of the file content on the label
  }
});
