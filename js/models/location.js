var Location = function(data) {
    var self = this;

    self.title = ko.observable(data.title);
    self.location = ko.observable(data.location);
}