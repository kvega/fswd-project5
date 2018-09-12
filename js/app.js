// Define global variables
// Map variable
var map;
var markers = [];
var polygon;

// Create our ViewModel
var ViewModel = function() {
    var self = this;

    self.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 36.970550, lng: -122.015760},
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
