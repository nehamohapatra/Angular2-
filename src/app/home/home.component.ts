import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { API } from '../http/http.service';
import { StoreService } from '../services/store.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [StoreService, API]
})

export class HomeComponent implements OnInit {
    emailForm: FormGroup
    constructor(private router: Router,
        private formBuilder: FormBuilder,
        private httpService: API,
        private storeService: StoreService) {
        var token = localStorage.getItem('token');
        var pid = localStorage.getItem('pId')
        if (token) {
            this.router.navigate(['/project-landing'])
        }
    }
    onVerify() {
        let self = this;
        let signUpEmail = { 'email': self.emailForm.value.email }
        self.httpService.fetchData('post', 'prelogin/v1/signup', function (data) {
            if (data.json().newUser) {
                self.storeService.setStore('newUserReg', { userId: data.json().data.userId })
                self.router.navigate(['email-onboarding']);
                //Store Email in the Shared Object
            } else {
                self.router.navigate(['login'], { queryParams: { msg: "You have already registered. Please login", email: self.emailForm.value.email } });
            }
        }, function (err) {
            console.log(err)
        }, signUpEmail)

    }

    onRegister() {
        this.router.navigate(['login']);
    }
    loginNavigate() {
        this.router.navigate(['login']);
    }
    signUpNavigate() {

        {
            let self = this;
            let signUpEmail = { 'email': self.emailForm.value.email }
            self.httpService.fetchData('post', 'prelogin/v1/signup', function (data) {
                if (data.json().newUser) {
                    self.storeService.setStore('newUserReg', { userId: data.json().data.userId })
                    self.router.navigate(['email-onboarding']);
                    //Store Email in the Shared Object
                } else {
                    self.router.navigate(['login'], { queryParams: { msg: "You have already registered. Please login", email: self.emailForm.value.email } });
                }
            }, function (err) {
                console.log(err)
            }, signUpEmail)

            //this.router.navigate(['email-onboarding']);
        }
    }
    ngOnInit() {
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.emailForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(emailRegex)]]
        })
        var elem = document.getElementById("header-wrap")
        if (elem) {
            window.onscroll = function () {
                if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30)
                    elem.className = "header-effect";
                else
                    elem.className = "navbar navbar-fixed-top header-wrap header-effect-off";
            };
        }
    }


}



