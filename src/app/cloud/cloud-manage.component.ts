import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { API } from '../http/http.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { getAwsRegions } from '../common/cloud';
import {CloudAccountComponent} from './cloud-account/cloud-account.component';
//Componet dependencies
@Component({
    templateUrl: './cloud-manage.html',
    styleUrls: ['../main.scss'],
    providers: [API, StoreService]
})

//Component logic container class

export class CloudManageComponent implements OnInit {
    flag: String = 'two';
    /*Layout Structure Width and Height start here*/
    resWidth: Number = window.innerWidth - 75;
    resHeight: Number = window.innerHeight - 145;
    cloudIndex: Number;
    searchItem: Boolean = false;
    showLoad:Boolean = true;
    disableTab:Boolean = true;
    contDetail: FormGroup;
    tableSearch: String;

    azureSelected : Boolean;
    isLoaded : Boolean;
    /*Layout Structure Width and Height end here*/
    constructor(private router: Router, private storeService: StoreService, private _formBuilder: FormBuilder, private httpService: API, public toastr: ToastsManager) {
    this.azureSelected = true;
    
    }
    changeEvent() {
        var self = this;
        console.log("Clicked outside");
        var elem = <HTMLElement>document.getElementsByClassName('update-data')[0];
         console.log("elem" ,elem);
        if (elem) {
            elem.click();
            console.log("Clicked")
        }

    }
    public containerItem;
    disconnectAcc(){
        this.disableTab = true;
    }
    afterConnect(){
        this.disableTab = false;
    }
    onSearchList() {
        var self = this;
        console.log(self.tableSearch);
        self.httpService.fetchData('get', 'v1/docker/getImageList/' + self.tableSearch, function (data) {
            data = data.json();
            self.containerItem = data.data;
            self.searchItem = true;
        }, function (err) {
            console.log("Error Getting docker image list", err);
            self.toastr.error('Error Getting docker image list', null, { animate: 'fade', toastLife: 3000 })
        }, {});
    }

    ngOnInit() {
        let self = this;
        self.cloudIndex = 2;
        this.contDetail = this._formBuilder.group({
            searchTxt: ['', [Validators.required]]
        })
        
            getAwsRegions(self);    
        
    }

    selectedCloudEnv(value){
        console.log("inside cloud manage");
        console.log("cloudemanage"+value);
        if(value === "azure"){
              this.azureSelected = false;
              this.isLoaded = true;
        }else{
              this.azureSelected=true;
              this.isLoaded = false;
        }
    }

    vmClick()
    {
      this.cloudIndex = 1;  
      console.log("vm clicked",this.cloudIndex);
    }
}