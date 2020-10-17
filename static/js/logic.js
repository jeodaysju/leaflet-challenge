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

d3.json(queryUrl).then(function(data) {

  L.geoJSON(data, 
    {
      pointToLayer: function (feature, latlng) 
      {
        return L.circleMarker(latlng, 
          {
            radius: feature.properties.mag*5,
            fillColor: "red",
            color: "#000",
            weight: 1,
            fillOpacity: 1 - (1/ feature.geometry.coordinates[2])
          });
      }
    }).addTo(myMap);
});

