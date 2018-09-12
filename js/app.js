// Define global variables
// Map variable
var map;
var markers = [];
var polygon;

var initialLocations = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
  ];

// Create our ViewModel
var ViewModel = function() {
    var self = this;

    self.locationList = ko.observableArray([]);

    initialLocations.forEach(function(locationData) {
        self.locationList.push(new Location(locationData));
    });

    self.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.7413549, lng: -73.9980244},
            zoom: 15, 
            gestureHandling: 'cooperative'
        });
    };
};

function initApp() {
    var vm = new ViewModel();
    vm.initMap();
    ko.applyBindings(vm);
};
