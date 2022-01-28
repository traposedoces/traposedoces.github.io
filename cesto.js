var myStorage = window.sessionStorage;
var myLocalStorage = window.localStorage;

var vm = function () {

    var self = this;

    self.price = ko.observable(25);
    self.showPrice = ko.computed(function () {
        return self.price() + '€'
    });
    self.qnt = ko.observable(3);
    self.qnt2 = ko.observable(5);
    self.preco1 = ko.observable(15);
    self.preco2 = ko.observable(1);
    self.evento = ko.observable('');
    self.alergia = ko.observable('');
    self.border = ko.observable('#476A6F');
    self.precototal = ko.observable('');
    self.showList = ko.observableArray([]);
    self.allList = ko.observableArray([]);
    self.glutenList = ko.observableArray([]);
    self.ovosList = ko.observableArray([]);
    self.lactoseList = ko.observableArray([]);
    self.frutosList = ko.observableArray([]);
    self.fullPrice = ko.observable(0);
    self.seila = ko.observableArray([]);
    self.fullList = ko.observableArray([]);
    self.totalPrice = ko.observable(0);
    self.help = ko.observableArray([]);
    self.precoTotal = ko.observable(0);
    self.precoTotal2 = ko.observable(69);

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

    var retVal;

    let full = 0;

    self.activate = function () {
        fetchJSONFile('./produtos.json', function (data) {
            self.showList(data.allList);
            self.allList(data.allList);
            self.glutenList(data.glutenList);
            self.ovosList(data.ovosList);
            self.lactoseList(data.lactoseList);
        });

        var fullLst1 = [];
        $.each(myStorage, function (key, value) {
            console.log(value);
            console.log(parseInt(value));
            fetchJSONFile('./produtos.json', function (data) {
                var id = parseInt(key);
                if (id < 12) {
                    var fullArr = data.allList;
                    var border = '#476A6F';
                    var nId = id;
                }
                else if (id < 23) {
                    var fullArr = data.glutenList;
                    var border = 'mediumseagreen';
                    var nId = id - 12;
                }
                else if (id < 30) {
                    var fullArr = data.ovosList;
                    var border = 'orange';
                    var nId = id - 23;
                }
                else {
                    var fullArr = data.lactoseList;
                    var border = 'dodgerblue';
                    var nId = id - 30;
                }
                console.log(fullArr[nId])
                retVal = fullArr[nId];
                retVal.Qntd = parseInt(value);
                
                retVal.Border = border;
                self.seila(retVal);
                fullLst1.push(self.seila());
                self.fullList(fullLst1);
                full += (self.seila().Preco * value);
                self.PrecoTotal = (full);
                console.log("Este é o preço total: " + self.PrecoTotal);
            });
            
        });
       
    }


    self.activate();

    var temporizador = setTimeout(updatePreco, 100);

    function updatePreco() {
        if (full <= 30) {
            self.precoTotal2(full);
        }
        else {
            self.precoTotal2(full * 0.8);
            console.log("Desconto aplicado 20%");
        }
        console.log("TOTAL: " + self.precoTotal2());
    };
    
}

$(document).ready(function () {
    console.log("ready!");
    myLocalStorage.clear();
    ko.applyBindings(new vm());
});