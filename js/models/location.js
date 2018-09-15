var Location = function(data, i, map = null) {
    var self = this;

    self.title = ko.observable(data.title);
    self.location = ko.observable(data.location);
    self.marker = new google.maps.Marker({
        position: self.location(),
        title: self.title(),
        animation: google.maps.Animation.DROP,
        id: i, 
        map: map
    });
}