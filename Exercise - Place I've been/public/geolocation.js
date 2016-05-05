var map;

if ("geolocation" in navigator){
  navigator.geolocation.getCurrentPosition(onLocation, onError);
}

function onLocation(position){
  var myPosition = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };

  createMap(myPosition);
  setupAutocomplete();
  loadAllMarkers();
}

function onError(err){
  console.log("What are you using, IE 7??", err);
}

function createMap(position){
  var mapOptions = {
    center: position,
    zoom: 17
  };
  map = new google.maps.Map($('#map')[0], mapOptions);
}

function createMarker(position, formatted_address) {
  showMarker(position, formatted_address);
  var markers = JSON.parse(localStorage.getItem("markers"));
  markers.push({"position": position, "address": formatted_address});
  localStorage.setItem("markers", JSON.stringify(markers));
}

function showMarker(position, formatted_address){
  var infowindow = new google.maps.InfoWindow({
    content: formatted_address
  });

  var marker = new google.maps.Marker({
    position: position,
    map: map
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function setupAutocomplete(){
  var input = $('#get-places')[0];
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function(){
    var place = autocomplete.getPlace();
    if (place.geometry.location) {
      createMarker(place.geometry.location, place.formatted_address);
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    } else {
      alert("The place has no location...?")
    }
  });
}

function loadAllMarkers() {
  if(localStorage.getItem("markers")){
    var markers = JSON.parse(localStorage.getItem("markers"));
    for (var i = 0; i < markers.length; i++) {  
      showMarker(markers[i].position, markers[i].address);
    }
  } else {
    localStorage.setItem("markers", "[]");
  }
}