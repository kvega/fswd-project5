var Location = function(data, i, map = null) {
    var self = this;

    self.title = ko.observable(data.name);
    self.location = ko.observable(data.location);
    self.address = ko.observable(data.address);
    self.categories = ko.observable(data.categories);
}