var Location = function(data, map = null) {
    var self = this;

    self.title = ko.observable(data.title);
    self.location = ko.observable(data.location);
    self.address = ko.observable(data.address);
    self.categories = ko.observable(data.categories);
    self.marker = new google.maps.Marker({
        position: self.location(),
        title: self.title(),
        animation: google.maps.Animation.DROP,
        map: map
    });
}