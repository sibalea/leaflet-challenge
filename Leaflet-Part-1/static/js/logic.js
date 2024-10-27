// Create the map
const map = L.map('map')
    .setView([37.09, -95.71], 4); // Center on the US

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Fetch earthquake data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(response => response.json())
    .then(data => {
        // Function to get color based on depth
        function getColor(depth) {
            return depth > 90 ? '#bd0026' :
                   depth > 70 ? '#f03b20' :
                   depth > 50 ? '#fd8d3c' :
                   depth > 30 ? '#feb24c' :
                   depth > 10 ? '#fed976' :
                                 '#ffffb2';
        }

        // Function to get radius based on magnitude
        function getRadius(magnitude) {
            return magnitude * 4; // Scale the radius
        }

        // Loop through each feature in the GeoJSON
        data.features.forEach(feature => {
            const coords = feature.geometry.coordinates;
            const magnitude = feature.properties.mag;
            const depth = coords[2];
            const color = getColor(depth);
            const radius = getRadius(magnitude);

            // Create a circle marker
            L.circleMarker([coords[1], coords[0]], {
                radius: radius,
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.6
            })
            .bindPopup(`<strong>Magnitude:</strong> ${magnitude}<br>
                         <strong>Depth:</strong> ${depth} km<br>
                         <strong>Location:</strong> ${feature.properties.place}`)
            .addTo(map);
        });

        // Create a legend
        const legend = L.control({position: 'bottomright'});
        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<strong>Depth (km)</strong><br>';
            div.innerHTML += '<i style="background: #bd0026"></i> > 90<br>';
            div.innerHTML += '<i style="background: #f03b20"></i> 70 - 90<br>';
            div.innerHTML += '<i style="background: #fd8d3c"></i> 50 - 70<br>';
            div.innerHTML += '<i style="background: #feb24c"></i> 30 - 50<br>';
            div.innerHTML += '<i style="background: #fed976"></i> 10 - 30<br>';
            div.innerHTML += '<i style="background: #ffffb2"></i> 0 - 10<br>';
            return div;
        };
        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching data:', error));