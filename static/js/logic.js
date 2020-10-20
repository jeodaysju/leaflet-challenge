var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-10-10&endtime=2020-10-15";

var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 3,
});

function markerSize(magnitude) {
  return magnitude / 40;
}

function opacityShade(depth) {
  return depth / 40;
}

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);


function chooseColor(depth) {

  if (-10 <= depth && depth <= 10)
    return "lightyellow";
  else if (10 < depth && depth <= 30)
    return "yellow";
  else if (30 < depth && depth <= 50)
    return "lightgreen";
  else if (50 < depth && depth <= 70)
    return "green";
  else if (70 < depth && depth <= 90)
    return "darkorange";
  else if (depth > 90)
    return "red";
  else
    return "black";
}

function scaledRadius(latitude, initialRadius)
{
  const radiusOfEarth = 6378137;
  latitude = latitude / 180 * Math.PI;
  const cosLat = Math.cos(latitude);
  const sinLat = Math.sin(latitude);
  return radiusOfEarth * Math.acos(Math.cos(initialRadius / radiusOfEarth) * cosLat * cosLat + sinLat * sinLat);
}

d3.json(queryUrl).then(function (data) {

  L.geoJSON(data,
    {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,
          {
            // radius: scaledRadius(feature.geometry.coordinates[1], feature.properties.mag * 5),
            radius: feature.properties.mag * 5,
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            fillOpacity: 1
          });
    
        function style(feature) {
            return {
                weight: 1.5,
                opacity: 1,
                fillOpacity: 1,
                radius: 6,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "grey"
    
            };
        }

        
      }
    }).addTo(myMap);
});

var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades =  ['Depth -10 to 10','Depth 10 to 30','Depth 30 to 50','Depth 50 to 70','Depth 70 to 90','Depth Greater Than 90'];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML += '<i style="background:' + chooseColor(grades[i]) + '"></i> ' + grades[i] + (grades[i] ? '&ndash;' + grades[i] + '<br>' : '+');
          }
          return div;
          };
    
    legend.addTo(myMap);





