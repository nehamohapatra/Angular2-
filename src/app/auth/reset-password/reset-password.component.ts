import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { API } from '../../http/http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: './reset-password.component.html',
    styleUrls: ['../../main.scss'],
    providers: [API]
})

export class ResetPwdComponent implements OnInit {
    forgotEmail: FormGroup;
    emailId: String;
    msgDiv: Boolean = false;
    contWidth: Number;
    errDiv: Boolean = false;
    msg: String = undefined;
    constructor(private router: Router, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private httpService: API) { }
    onReseted() {
        let self = this;
        let signUpEmail = { 'email': self.forgotEmail.value.email };
        // console.log("In", self.forgotEmail.value.email);
        self.httpService.fetchData('post', 'prelogin/v1/forgotPassword', function (data) {
            data = data.json();
            // console.log("Repo Array", data.message);
            self.msgDiv = true;
            self.msg = "Instruction to reset password has been emailed to you.\nKindly check your inbox."
            // self.router.navigate(['/']);
        }, function (err) {
            self.msgDiv = true;
            self.msg = "Instruction to reset password has been emailed to you.\nKindly check your inbox."
            // console.log("Error Getting Repo list", err);
            // self.router.navigate(['/']);
        }, signUpEmail);
    }
    /*onHome(){
        this.router.navigate(['/']);
    }*/
    onLogin(){
        this.router.navigate(['/login']);
    }
    ngOnInit() {
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.forgotEmail = this.formBuilder.group({
            email: ['', [Validators.required,Validators.pattern(emailRegex)]]
        });
    }
    ngAfterViewInit() {
        //To check user connected with gitHub
        var self = this;
        // setTimeout(() => {
        //     self.contWidth = document.querySelector('.deploy-content-container').clientWidth - 1
        // })
        self.activatedRoute.queryParams.subscribe(
            (param: any) => {
                self.msg = param['msg'];
            });
            if(self.msg !== undefined){
                self.errDiv = true;
            }
            console.log("Printing..", window.innerWidth, window.innerHeight);
    }
};
