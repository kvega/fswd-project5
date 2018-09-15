// Define global variables
// Map variable
var map;
var markers = ko.observableArray([]);
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

    self.filter = ko.observable();
    self.locationList = ko.observableArray([]);

    initialLocations.forEach(function(locationData, i) {
        self.locationList.push(new Location(locationData, i));
    });

    self.initMap = function() {
        // Constructor for new map object
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.7413549, lng: -73.9980244},
            zoom: 14, 
            gestureHandling: 'cooperative'
        });

        // Create an array of markers on the map
        for (var i = 0; i < self.locationList().length; i++) {
            var location = self.locationList()[i];
            var marker = location.marker;
            marker.setIcon(defaultMarker);
            marker.setMap(map);

            marker.infowindow = new google.maps.InfoWindow();

            self.populateInfoWindow(marker, marker.infowindow);

            // Push the marker onto the markers array
            markers.push(marker);

            // TODO: add eventListener for each marker
            marker.addListener('click', function() {
                this.infowindow.open(map, this);
            });

            
        };
    };

    self.filterLocations = ko.computed(function() {
        var filter = self.filter();
        var filteredList = [];
        if (filter) {
            ko.utils.arrayForEach(self.locationList(), function(location) {
                if (String(location.title()).toLowerCase().includes(String(filter).toLowerCase())) {
                    filteredList.push(location);
                    location.marker.setMap(map);
                } else {
                    location.marker.setMap(null);
                }
            });
        } else {
            filteredList = self.locationList();
            ko.utils.arrayForEach(filteredList, function(location) {
                location.marker.setMap(map);
            });
        };
        return filteredList;
    });

    self.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Clear marker property if the infowindow is closed
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
            infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>' + marker.position.lat() + ', ' +  marker.position.lng() + '</div>');
        }
    };

    self.openLocationInfo = function(location) {
        location.marker.setIcon(makeMarkerIcon('00FF24'))
        toggleBounce(location.marker);
    }

    self.closeLocationInfo = function(location) {
        location.marker.setIcon(makeMarkerIcon('ea4335'))
        toggleBounce(location.marker);
    }
    
    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    function makeMarkerIcon(markerColor) {
        var googleChartsURL = 'http://chart.googleapis.com/chart?';
        var pinType = 'chst=d_map_pin_icon&';
        var chld = 'chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2';
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    }

    var defaultMarker = makeMarkerIcon('ea4335');
    var highlightedMarker = makeMarkerIcon('00FF24')
};

function initApp() {
    var vm = new ViewModel();
    vm.initMap();
    ko.applyBindings(vm);
};
