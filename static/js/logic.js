var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-10-10&endtime=2020-10-15";

var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
});

function markerSize(magnitude) {
  return magnitude / 40;
}

function opacityShade(depth) {
  return depth / 40;
}

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
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
      }
    }).addTo(myMap);
});

