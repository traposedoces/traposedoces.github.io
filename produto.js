var vm = function () {

    var self = this;

    self.border = ko.observable('#476A6F')

    self.qnt = ko.observable(1);
    self.ingr = ko.observableArray([]);
    self.name = ko.observable('');
    self.preco = ko.observable(0);
    self.foto = ko.observable('');
    self.allList = ko.observableArray([]);
    self.precoStr = ko.computed(function () {
        return self.preco() + "€/unidade";
    });

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

    self.activate = function (id) {
        fetchJSONFile('./produtos.json', function (data) {

            if (id < 12) {
                var fullArr = data.allList;
                self.border('#476A6F');
                var nId = id;
            }
            else if (id < 23) {
                var fullArr = data.glutenList;
                self.border('mediumseagreen');
                var nId = id - 12;
            }
            else if (id < 30) {
                var fullArr = data.ovosList;
                self.border('orange');
                var nId = id - 23;
            }
            else {
                var fullArr = data.lactoseList;
                self.border('dodgerblue');
                var nId = id - 30;
            }
            console.log(fullArr);

            var prod = fullArr[nId];
            console.log(prod);

            self.name(prod.Nome);
            console.log(self.name());

            self.preco(prod.Preco);
            console.log(self.preco());

            self.foto(prod.Foto);
            console.log(self.foto());

            self.ingr(prod.Ingredientes);
            console.log(self.ingr());
        });
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };


    self.add = function () {
        console.log("add");
        var n = self.qnt();

        if (n < 100) {
            var k = n + 1;
            self.qnt(k);
        }
    }

    self.sub = function () {
        console.log("sub");
        var n = self.qnt();

        if (n > 1) {
            var k = n - 1;
            self.qnt(k);
        }
    }


    adicionarCesto = function () {
        console.log("adicionarCesto");
        var produto = getUrlParameter('id');
        console.log(produto);
        var quantidade = self.qnt;
        var arrayPQ = {
            produto : getUrlParameter('id'),
            quantidade : self.qnt
        };
        var jsonData = ko.toJSON(arrayPQ);
        console.log(jsonData);
        $.post("cesto.json", jsonData, function (returnedData) {
            console.log("sucess")   
        })
    }

    var pg = getUrlParameter('id');
    console.log(pg);

    self.activate(pg);
}


$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});