# chizu

This project allows the user to select the countries they wish to visit, and the countries they have already visited. The countries they wish to visit become marked in purple on the map, while the countries that have been visited get marked in green. A list gets populated next to the map as well. There is also an option to export the list data in JSON format. The JavaScript library P5.js was used. Leaflet.js was used for creating the map. Once the leaflet map is clicked, the coordinate data of the clicked point is used in an API call which returns the name of the clicked country. That country is then marked into purple or green, depending on the value of the radiobutton. The data required for marking the countries is taken from the .geojson files downloaded from a Github repository.

## Tech Stack

**Client:** HTML/CSS/JS, P5.js, leaflet.js

**API:** Geonames
