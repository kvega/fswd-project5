// Define global variables
// Map variable
var map;
var markers = ko.observableArray([]);
const CLIENT_ID = 'LT2XDVYLCLY13G0O1CPIJ5YEJXGG1YHV0LISYQZIGKZYZUN0';
const CLIENT_SECRET = 'HC11QNZJOTN4CZRIT30VHGKE30VE4BVMW03TGRYZ4L0N5MMN';

var initialLocations = [];

// Create our ViewModel
var ViewModel = function() {
    var self = this;

    self.filter = ko.observable();
    self.locationList = ko.observableArray([]);

    
    console.log("Initial Locations:\n");
    console.log(initialLocations);

    initialLocations.forEach(function(locationData) {
        self.locationList.push(new Location(locationData));
        console.log("location success")
    });

    console.log(self.locationList());

    self.initMap = function() {
        // Constructor for new map object
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.7413549, lng: -73.9980244}, //{lat: 36.9741, lng: -122.0308},
            zoom: 14, 
            gestureHandling: 'cooperative'
        });

        // Create an array of markers on the map
        for (var i = 0; i < self.locationList().length; i++) {
            var location = self.locationList()[i];
            console.log("Creating marker")
            var marker = new google.maps.Marker({
                position: location.location(),
                title: location.title(),
                animation: google.maps.Animation.DROP, 
                map: map
            });
            location.marker = marker;
            marker.setIcon(defaultMarker);

            marker.infowindow = new google.maps.InfoWindow();

            self.populateInfoWindow(marker, marker.infowindow);

            // Push the marker onto the markers array
            markers.push(marker);

            // TODO: add eventListener for each marker
            marker.addListener('click', function() {
                this.infowindow.open(map, this);
            });

            marker.addListener('mouseover', function() {
                this.setIcon(highlightedMarker);
            });

            marker.addListener('mouseout', function() {
                this.setIcon(defaultMarker);
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

    self.clickLocationInfo = function(location) {
        location.marker.infowindow.open(map, location.marker);
    }

    self.mouseoverLocationInfo = function(location) {
        location.marker.setIcon(makeMarkerIcon('00FF24'))
        toggleBounce(location.marker);
    }

    self.mouseoutLocationInfo = function(location) {
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


function getFoursquareInfo(location) {
    var array = [];
    $.getJSON('https://api.foursquare.com/v2/venues/explore', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        near: location,
        v: '20180323', 
        limit: 20
    }, function(result) {
        console.log(result);
    }).done(function(result) {
        $.each(result.response.groups[0].items, function(i, item) {
            array.push({
                title: item.venue.name,
                location: {
                    lat: item.venue.location.lat,
                    lng: item.venue.location.lng
                },
                address: item.venue.location.formattedAddress.join(', '),
                categories: item.venue.categories
            });
        });
        initialLocations = array;
        var vm = new ViewModel();
        vm.initMap();
        ko.applyBindings(vm);
    })
}

function initApp() {
    getFoursquareInfo('New York, NY');
};
