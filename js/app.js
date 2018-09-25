// Define global variables
// Map variable
var map;

// Set location to Santa Cruz, CA
var mainLocationSC = {
    lat: 36.9741,
    lng: -122.0308
};

// Set location to New York, NY
var mainLocationNY = {
    lat: 40.7413549,
    lng: -73.9980244
};

// Client ID and Secret for Foursquare API
const CLIENT_ID = 'LT2XDVYLCLY13G0O1CPIJ5YEJXGG1YHV0LISYQZIGKZYZUN0';
const CLIENT_SECRET = 'HC11QNZJOTN4CZRIT30VHGKE30VE4BVMW03TGRYZ4L0N5MMN';

// Array for locations loaded by Foursquare response
var initialLocations = [];

// Create our ViewModel
var ViewModel = function () {
    var self = this;

    self.markers = [];
    self.infoWindow = new google.maps.InfoWindow();
    self.defaultMarker = makeMarkerIcon('ea4335');
    self.highlightedMarker = makeMarkerIcon('00FF24');
    self.isSidebarOpen = ko.observable();
    self.filter = ko.observable();
    self.locationList = ko.observableArray([]);

    // Filters markers and list entries displayed based on search criteria
    // Makes use of the self.filter observable to return matching results
    // Returns a filtered list of locations
    self.filterLocations = ko.computed(function () {
        var filter = self.filter();
        var filteredList = [];
        if (filter) {
            ko.utils.arrayForEach(self.locationList(), function (location) {
                if (String(location.title()).toLowerCase().includes(String(filter).toLowerCase()) || location.categories().includes(String(filter).toLowerCase())) {
                    filteredList.push(location);
                    self.markers[location.id].setMap(map);
                } else {
                    self.markers[location.id].setMap(null);
                }
            });
        } else {
            filteredList = self.locationList();
            ko.utils.arrayForEach(filteredList, function (location) {
                if (self.markers.length > 0) {
                    self.markers[location.id].setMap(map);
                }
            });
        };
        return filteredList;
    });

    // For each location retrieved from Foursquare, create a Location object and add to ViewModel's list of Locations
    initialLocations.forEach(function (locationData, i) {
        self.locationList.push(new Location(locationData, i));
    });

    // Function used to initialize Google Map
    self.initMap = function () {
        // Constructor for new map object
        map = new google.maps.Map(document.getElementById('map'), {
            center: mainLocationSC,
            zoom: 16,
            gestureHandling: 'cooperative'
        });

        // Create an array of markers on the map
        for (var i = 0; i < self.locationList().length; i++) {
            var location = self.locationList()[i];
            var marker = new google.maps.Marker({
                position: location.location(),
                title: location.title(),
                animation: google.maps.Animation.DROP,
                map: map,
                address: location.address()
            });

            // Set icon for marker
            marker.setIcon(self.defaultMarker);

            // Create a new InfoWindow specific to this marker
            var infowindow = new google.maps.InfoWindow();
            marker.infowindow = infowindow;

            // Populate InfoWindow
            populateInfoWindow(marker, infowindow);

            // Push the marker onto the markers array
            self.markers.push(marker);

            // Add eventListeners to each marker
            marker.addListener('click', function () {
                self.infoWindow.close();
                self.infoWindow = this.infowindow;
                self.infoWindow.open(map, this);
            });

            marker.addListener('mouseover', function () {
                this.setIcon(self.highlightedMarker);
            });

            marker.addListener('mouseout', function () {
                this.setIcon(self.defaultMarker);
            });
        };
    };

    // Set action for when user clicks on location list item
    self.clickLocationInfo = function (location) {
        var marker = self.markers[location.id];
        self.infoWindow.close();
        self.infoWindow = marker.infowindow;
        self.infoWindow.open(map, marker);
    };

    // Animates marker on map when user hovers over the corresponding list entry
    self.mouseoverLocationInfo = function (location) {
        var marker = self.markers[location.id];
        marker.setIcon(makeMarkerIcon('00FF24'))
        toggleBounce(marker);
    };

    // Resets animation for when user no longer hovers list entry
    self.mouseoutLocationInfo = function (location) {
        var marker = self.markers[location.id];
        marker.setIcon(makeMarkerIcon('ea4335'))
        toggleBounce(marker);
    };

    // Toggle the sidebar
    self.toggleSidebar = function() {
        if (self.isSidebarOpen()) {
            self.isSidebarOpen(false);
        } else {
            self.isSidebarOpen(true);
        }
        console.log(self.isSidebarOpen());
    };
};

// Animate marker
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    };
};

// Create marker icon
function makeMarkerIcon(markerColor) {
    var googleChartsURL = 'http://chart.googleapis.com/chart?';
    var pinType = 'chst=d_map_pin_icon&';
    var chld = 'chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2';
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
};

// Set html in InfoWindow
function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        // Clear marker property if the infowindow is closed
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
        infowindow.setContent('<div><h1>' + marker.title + '</h1></div><br>' +
            '<div>' + marker.address + '</div><br>');
    }
};

// Alert user of Google Maps API error
function googleMapsError() {
    alert("Uh oh! Looks like we encountered an error opening Google Maps. Please refresh the page and try again.");
}

// Make request to Foursquare API
function getFoursquareInfo(location) {
    var array = [];
    $.getJSON('https://api.foursquare.com/v2/venues/explore', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        ll: String(location.lat) + ', ' + String(location.lng),
        v: '20180323',
        limit: 30
    }, function (result) {
        console.log("success");
        console.log(result);
    }).done(function (result) {
        $.each(result.response.groups[0].items, function (i, item) {
            array.push({
                title: item.venue.name,
                location: {
                    lat: item.venue.location.lat,
                    lng: item.venue.location.lng
                },
                address: item.venue.location.formattedAddress.join(', '),
                categories: String(item.venue.categories[0].name).toLowerCase()
            });
        });
        initialLocations = array;
        var vm = new ViewModel();
        vm.initMap();
        ko.applyBindings(vm);
    }).fail(function () {
        alert("Oh no! Something went wrong! Please refresh the page and try again.");
    }).always(function () {
        console.log("complete");
    })
};

function initApp() {
    getFoursquareInfo(mainLocationSC);
};