var Location = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};

var LocationsView = function() {
    this.locationFilter = ko.observable();
    this.locationList = ko.observableArray([]);

};

var MapView = function() {

};

var ViewModel = function() {

};