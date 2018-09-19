var Location = function(data, i) {
    var self = this;

    self.id = i;
    self.title = ko.observable(data.title);
    self.location = ko.observable(data.location);
    self.address = ko.observable(data.address);
    self.categories = ko.observable(data.categories);
}