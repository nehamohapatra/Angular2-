import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MaterialModule,MdDialogRef,MdDialog } from '@angular/material';
import { API } from '../../http/http.service';

@Component({
  templateUrl: './edit-profile.component.html',
  styleUrls: ['../../main.scss'],
  providers: [API]
})
export class EditProfileComponent implements OnInit {
   dialogRef: MdDialogRef<EditProfile>;

  profileForm: FormGroup;
  imgSrc: String;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private httpService: API,
    public dialog: MdDialog) { }

  openDialog() {
    document.getElementById("profilePhoto").click()
  }

  //open dialog of angular 2 material
  openDialogBox() {
    this.dialogRef = this.dialog.open(EditProfile, {
      disableClose: false
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('result: ' + result);
      this.dialogRef = null;
    });
  }

  onUpdateClick() {
    console.log("ndnskdns")
    let self = this;
    self.httpService.fetchData('post',"v1/profileDetails", function (data) {  
      data = data.json()
      if (data && data.success) {
        console.log("yes, success")
        //self.router.navigate(['setup-password']);
      }
    }, function (err) {      
      console.log(err)
      console.log("no, success")
    }, self.profileForm.value);
  }

  fileChange(event) {
    let self = this
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      console.log(file);
      if(file.size > 2097152){
        alert("Error :Your file size is more than 2MB")
        return;
      }
      if (!file.name.match(/\.(jpg|jpeg|png)$/)){
        alert("Error:File Format is not Supported");
        return;
      }
      
      let formData: FormData = new FormData();
      formData.append('photo', file, file.name);
      self.httpService.uploadFile('post', "v1/profileImage", function (data) {
        data = data.json()
        if (data) {
           var reader = new FileReader();
           reader.readAsDataURL(file);
           reader.onload = function (e) {
             console.log("eee",e)
                   self.imgSrc = e.target['result'];
                };
          console.log("Success", data)
          self.profileForm.patchValue({ "tempFileName": data.filename });
          self.profileForm.patchValue({ "tempFileNameExt": data.originalname.split('.').pop()});                    
        }
      }, function (err) {
        console.log("Error Uploading the Photo", err)
      }, formData)

    } else {
      console.log("Couldn't Pick up file from Browser")
    }
  }

  ngOnInit() {
    let self = this;
    self.imgSrc = "images/profile-pic.png";
    self.httpService.fetchData('get', "v1/getUserDetails", function (data) {
      data = data.json()
      if (data && data.success) {
        console.log(data)
        self.profileForm.patchValue(data.data);
      }
    }, function (err) {
      console.log(err)
    }, {})
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.profileForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobile: [''],
      email: [''],
      tempFileName: [''],
      tempFileNameExt: [''],
      organization: [''],
    })
  }

}

//Edit Profile picture modal component

@Component({
  selector: 'edit-dialog',
  template: `
  <button type="button" (click)="dialogRef.close('yes')">Yes</button>
  <button type="button" (click)="dialogRef.close('no')">No</button>
  `
})
export class EditProfile {
  constructor(public dialogRef: MdDialogRef<EditProfile>) { }
}