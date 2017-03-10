(function () {
    'use strict';

    angular.module('CookieBuyer', [])
    .controller('ToBuyController', ToBuyController)
    .controller('AlreadyBoughtController', AlreadyBoughtController)
    //.service('ShoppingService', ShoppingService)
    .provider('ShoppingListCheckOffService', ShoppingListCheckOffServiceProvider)
    .config(Config)
    ;

    //setups the starting item list
    Config.$inject = ['ShoppingListCheckOffServiceProvider'];
    function Config(provider) {
        provider.startingItems = [
            { name: "Cookie1", quantity: 10 },
            { name: "Cookie2", quantity: 20 },
            { name: "Cookie3", quantity: 30 },
            { name: "Cookie4", quantity: 40 },
            { name: "Cookie5", quantity: 50 }
        ];
    }

    //setups the singleton service with the default toBuyList 
    function ShoppingListCheckOffServiceProvider() {
        var provider = this;
        provider.startingItems = [];

        provider.$get = function () {
            var service = new ShoppingListCheckOffService(provider.startingItems);
            return service;
        }
    }


    //controller for the tobuy list
    ToBuyController.$inject = ['ShoppingListCheckOffService'];
    function ToBuyController(service) {
        var controller = this;
        
        controller.items = service.getItemsToBuy();

        controller.buyItem = function (index) {
            service.buyItem(index);
        };
    }


    //controller for the bought list
    AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
    function AlreadyBoughtController(service) {
        var controller = this;

        controller.items =service.getItemsBought();

    }


    //service 
    function ShoppingListCheckOffService(startingItems) {
        var service = this;

        var itemsToBuy = startingItems;
        var itemsBought = [];

        //moves items from tobuy -> bought
        service.buyItem = function (itemIndex) {
            if ((itemIndex === undefined) ||
                ((itemIndex !== undefined) && (itemIndex < itemsToBuy.length) && (itemIndex >= 0))) {

                itemsBought.push(itemsToBuy[itemIndex]);
                itemsToBuy.splice(itemIndex, 1);
            } else {
                throw new Error("Item (" + itemIndex + ") out of range.");
            }
        };

        service.getItemsToBuy = function () {
            return itemsToBuy;
        };
        service.getItemsBought = function () {
            return itemsBought;
        };
    }

})();
