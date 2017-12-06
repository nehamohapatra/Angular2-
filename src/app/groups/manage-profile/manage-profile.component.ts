import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MaterialModule,MdDialogRef,MdDialog } from '@angular/material';
import { API } from '../../http/http.service';

@Component({
  templateUrl: './manage-profile.html',
  // styleUrls: ['./manage-profile.scss'],
  styleUrls: ['../../main.scss'],
  providers: [API]
})
export class ManageProfileComponent implements OnInit {
  flag:String = 'six'; 
  profileForm: FormGroup;
  imgSrc: String;
  fName: String;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private httpService: API,
    public dialog: MdDialog) { }

    readonlyFlag: Boolean = true;
    saveCanBtnFlag: Boolean = false;
    editBtnFlag: Boolean = true;
    updateCanBtnFlag: Boolean = false;
    passwordFlag: Boolean = false;
    changeBtnFlag: Boolean = true;

 
  onEditProfile(){
    
    this.saveCanBtnFlag = true;
    this.editBtnFlag = false;
    this.readonlyFlag = false;
  }

  onCancelBtn(){

    this.saveCanBtnFlag = false;
    this.editBtnFlag = true;
    this.readonlyFlag = true;
    this.profileForm.reset();
  }

  onSaveBtn(){

    let self = this;
    let formData = self.profileForm.value;
    let url = "";
    let payload = { fName: formData.firstName, lName: formData.lastName, mobile: formData.mobile, org: formData.organization };
    //api here//
  }

  onChangeBtn(){

    this.updateCanBtnFlag = true;
    this.passwordFlag = true;
    this.changeBtnFlag = false;
  }
  onPassChangeCancel(){

    this.updateCanBtnFlag = false;
    this.passwordFlag = false;
    this.changeBtnFlag = true;

  }

  ngOnInit() {
    // let self = this;
    // self.imgSrc = "images/profile-pic.png";
    // self.httpService.fetchData('get', "v1/getUserDetails", function (data) {
    //   data = data.json()
    //   if (data && data.success) {
    //     console.log(data)
    //     self.profileForm.patchValue(data.data);
    //   }
    // }, function (err) {
    //   console.log(err)
    // }, {})
    // var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.profileForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobile: [''],
      email: [''],
      organization: [''],
    })
  }

}

//Edit Profile picture modal component

