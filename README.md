# Raw heartrate and accelerometer retriever app for an e-health project at LNU 

The app consists of three parts: 

1. The watch app, "Reading", is installed on the watch through the Fitbit companion app on a phone.
   - Main code located at: ehealth-fitbit/fitbitLNU-app/app/index.js

2. The Companion app is automatically added to the Fitbit companion app on a phone.
   - Code located at: ehealth-fitbit/fitbitLNU-app/companion/index.js

3. A web server to download the raw data produced by the Watch App through the Companion App.
   - Code located at: ehealth-fitbit/fitbitLNU-data-retriever/index.php
   - The web-server is currently hosted at: [https://cscloud6-77.lnu.se/fitbit/](https://cscloud6-77.lnu.se/fitbit/)
