import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-home',
  templateUrl: './registration.component.html',
  styleUrls: ['../../main.scss'],
  providers: [StoreService, API]
})
export class RegistrationComponent implements OnInit {
  elemTop: number = 150;
  onBoardMeForm: FormGroup
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private httpService: API,
    private storeService: StoreService) { }
  onBoardme() {
    let self =this;
        let signUpEmail = { 'email': self.onBoardMeForm.value.email }
        self.httpService.fetchData('post', 'prelogin/v1/signup',function (data) {            
            if(data.json().newUser){
                self.storeService.setStore('newUserReg',{userId:data.json().data.userId})
                self.router.navigate(['email-onboarding']);
                //Store Email in the Shared Object
            }else{
                self.router.navigate(['login'],{queryParams: {msg:"You have already registered. Please login",email:self.onBoardMeForm.value.email}});                                
            }
        }, function (err) {
            console.log(err)
        },signUpEmail)

    //this.router.navigate(['email-onboarding']);
  }

  onNewuserClick() {
    this.router.navigate(['login']);
  }

  ngOnInit() {
    var self = this;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.onBoardMeForm = this.formBuilder.group({
            email: ['', [Validators.required,Validators.pattern(emailRegex)]]
        })
    setTimeout(function () {
      const authWrap = document.getElementsByClassName('auth-wrap')[0]
      const fullHeight = window.innerHeight / 2
      const elemTop = fullHeight - authWrap.clientHeight / 2;
      self.elemTop = elemTop;
    })
  }

}
