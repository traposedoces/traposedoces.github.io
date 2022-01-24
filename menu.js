var vm = function () {

    var self = this;

    self.price = ko.observable(25);
    self.showPrice = ko.computed(function () {
        return self.price() + '€'
    });

    self.evento = ko.observable('');
    self.alergia = ko.observable('');
    self.border = ko.observable('#476A6F');

    self.showList = ko.observableArray([]);
    self.allList = ko.observableArray([]);
    self.glutenList = ko.observableArray([]);
    self.ovosList = ko.observableArray([]);
    self.lactoseList = ko.observableArray([]);
    self.frutosList = ko.observableArray([]);

    self.clear = function () {
        console.log("Clear")
        $("input:radio").prop("checked", false);
        self.evento('');
        self.alergia('');
        self.price(25);
    }

    self.check = function () {
        console.log(self.price());
        console.log(self.evento());
        console.log(self.alergia());
    }

    function fetchJSONFile(path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.overrideMimeType("application/json;charset=iso-8859-1");
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) callback(data);
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    }

    function checkPrice(p) {
        return p <= self.price();
    }

    self.update = function () {
        console.log('Updating...');
        var nShow = [];
        if (self.alergia() == 'Glúten') {
            nShow = self.glutenList();
            self.border('mediumseagreen');
        }
        else if (self.alergia() == 'Ovos') {
            nShow = self.ovosList();
            self.border('orange');
        }
        else if (self.alergia() == 'Lactose') {
            nShow = self.lactoseList();
            self.border('dodgerblue');
        }
        else {
            nShow = self.allList();
            self.border('#476A6F');
        }

        console.log(nShow);
        var actualShow = [];

        nShow.forEach(function (element) {
            if (element.Preco <= self.price()) {
                actualShow.push(element);
                console.log('check');
            }
        });
        self.showList(actualShow);
        console.log(actualShow);
    }

    self.activate = function () {
        fetchJSONFile('./produtos.json', function (data) {
            self.showList(data.allList);
            self.allList(data.allList);
            self.glutenList(data.glutenList);
            self.ovosList(data.ovosList);
            self.lactoseList(data.lactoseList);
        });
    }


    self.activate();
}

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});