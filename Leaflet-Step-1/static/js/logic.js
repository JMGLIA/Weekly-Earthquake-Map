const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data);
    createFeatures(data.features);
});



function createFeatures(earthquakeData) {

    function onEachLayer(feature){
        return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: quakeSize(feature.properties.mag),
            fill0pacity: 0.8,
            color: quakeColor(feature.properties.mag),
            fillColor: quakeColor(feature.properties.mag)
        });
    }

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: onEachLayer
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

     // Define a baseMaps object to hold our base layers
     var baseMaps = {
        "All Those Countries": grayscalemap,
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };


    var myMap = L.map("map", {
        center: [
            0.00, 0.00
        ],
        zoom: 2,
        layers: [earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
    
        var div = L.DomUtil.create("div", "legend"),
            magnitudes = [0, 1, 2, 3, 4, 5];
    
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + quakeColor(magnitudes[i]) + '"></i> ' + 
        + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
        }
    
        return div;
    };
    
    legend.addTo(myMap);

};

function quakeColor(magnitude){
    if (magnitude >= 5){
        return "DarkRed"
    }
    else if (magnitude >= 4){
        return "IndianRed"
    }
    else if (magnitude >= 3){
        return "LightCoral"
    }
    else if (magnitude >= 2){
        return "LightSalmon"
    }
    else if (magnitude >= 1){
        return "LightSeaGreen"
    }
    else {
        return "MediumSpringGreen"
    }
};

function quakeSize(magnitude){
    return magnitude ** 2;
};