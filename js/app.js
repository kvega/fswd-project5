var keyLocations = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

var Location = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};

var LocationsView = function() {
    var self = this;
    self.locationFilter = ko.observable();
    self.locationList = ko.observableArray([]);

    keyLocations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem))
    });



};

var MapView = function() {

};

var ViewModel = function() {
    var self = this;

    self.locationsView = new LocationsView();
    self.locationList = self.locationsView.locationList;
};

ko.applyBindings(new ViewModel());