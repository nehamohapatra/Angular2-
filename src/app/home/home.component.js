var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var http_service_1 = require('../http/http.service');
var store_service_1 = require('../services/store.service');
var HomeComponent = (function () {
    function HomeComponent(router, formBuilder, httpService, storeService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.httpService = httpService;
        this.storeService = storeService;
    }
    HomeComponent.prototype.onVerify = function () {
        var self = this;
        var signUpEmail = { 'email': self.emailForm.value.email };
        self.httpService.fetchData('post', 'prelogin/v1/signup', function (data) {
            if (data.json().newUser) {
                self.storeService.setStore('newUserReg', { userId: data.json().data.userId });
                self.router.navigate(['email-onboarding']);
            }
            else {
                self.router.navigate(['login'], { queryParams: { msg: "You have already registered. Please login" } });
            }
        }, function (err) {
            console.log(err);
        }, signUpEmail);
    };
    HomeComponent.prototype.onRegister = function () {
        this.router.navigate(['login']);
    };
    HomeComponent.prototype.ngOnInit = function () {
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.emailForm = this.formBuilder.group({
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern(emailRegex)]]
        });
        var elem = document.getElementById("header-wrap");
        if (elem) {
            window.onscroll = function () {
                if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                    elem.className = "header-effect";
                }
                else {
                    elem.className = "";
                }
            };
        }
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.css'],
            providers: [store_service_1.StoreService, http_service_1.API, store_service_1.StoreService]
        })
    ], HomeComponent);
    return HomeComponent;
})();
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map