import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { API } from '../../http/http.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { getAwsRegions } from '../../common/cloud';
import {AzureAccountComponent} from '../cloud-account/azure-account.component';
//Componet dependencies
@Component({
    selector:'aws-onboard',
    templateUrl: './aws-onboard.html',
    styleUrls: ['../../main.scss'],
   providers: [API, StoreService,AzureAccountComponent]
})

//Component logic container class

export class AwsOnboardComponent implements OnInit {
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
    /*Layout Structure Width and Height end here*/
    constructor(private azurComp:AzureAccountComponent,private router: Router, private storeService: StoreService, private _formBuilder: FormBuilder, private httpService: API, public toastr: ToastsManager) { }
    changeEvent() {
        var self = this;
        var elem = <HTMLElement>document.getElementsByClassName('update-data')[0]
        if (elem) {
            elem.click();
            console.log("Clicked")
        }
// console.log("azur compobnent" + '' +this.azurComp.azureAdd+'aws='+this.azurComp.addDetail);
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


}