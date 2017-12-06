import { Component, AfterViewInit, OnInit, ViewChild, Renderer, Output, EventEmitter, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { scmConnect } from '../../common/repository';
import * as _ from 'lodash';
import { MdDialog } from '@angular/material';
import { API } from '../../http/http.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { getAwsStaticRegions } from '../../common/cloud';
@Component({
    selector: 'cloud-azure',
    templateUrl: './cloud-azure.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService]
})

//Component logic container class

export class CloudAzureComponent implements AfterViewInit {
        contWidth: Number;
        ftUser: Boolean = false;
        serviceIndex: Number;
        diskCount: number = 0;
        showDisk1: Boolean = false;
        selectedAzureVendor:any;
        elasticIpshow: Boolean = true;
        disks: any;
        manageTitle: [String] = ["", "Repository", "Build", "Something"];
        azureDetail: FormGroup;
        changeForm: String;
        storageAccountRadio:String ='LRS';
        diskRadioSelect:String='Standarad';
        ipAddressSelect:String='Static';
        cloudvendors:any = [
                {caps: "AWS", small: "aws"},
                {caps: "Azure", small: "azure"}
        ];
        vnet =[
            {value:"1",viewValue:"Vnet 1"},
            {value:"2",viewValue:"Vnet 2"},
            {value:"3",viewValue:"Vnet 3"},
            {value:"4",viewValue:"Vnet 4"},
        ];

        subnet =[
          {value:"1",viewValue:"Subnet A"},
          {value:"2",viewValue:"Subnet B"},
          {value:"3",viewValue:"Subnet C"},
          {value:"4",viewValue:"Subnet D"},
        ];

        vm = [
            {value:"1",viewValue:"A-series"},
            {value:"2",viewValue:"Av2-series"},
            {value:"3",viewValue:"D-series"},
            {value:"4",viewValue:"Dv2-series"},
            {value:"5",viewValue:"G-series"},
            {value:"6",viewValue:"H-series"}
        ];

        vm2 =[
          {value:"1",viewValue:"ExtraSmall"},
          {value:"2",viewValue:"Small"},
          {value:"3",viewValue:"Medium"},
          {value:"4",viewValue:"Large"}
        ];

        resource = [
          {value:"1",viewValue:"Resource Group 1"},
          {value:"2",viewValue:"Resource Group 2"},
          {value:"3",viewValue:"Resource Group 3"},
          {value:"4",viewValue:"Resource Group 4"},
        ];

        storageAccount = [
         {value:"1",viewValue:"Storage Account 1"},
         {value:"2",viewValue:"Storage Account 2"},
         {value:"3",viewValue:"Storage Account 3"},
         {value:"4",viewValue:"Storage Account 4"},
        ];
        osBase = [
        {value:"1",viewValue:"Linux"},
        {value:"2",viewValue:"Windows"},
        ];
       osBasePublish = [
           {value:"1",viewValue:"Publisher1"},
           {value:"2",viewValue:"Publisher2"},
           {value:"3",viewValue:"Publisher3"},
           {value:"4",viewValue:"Publisher4"}
       ];
        osBaseOffer = [
           {value:"1",viewValue:"Offer 1"},
           {value:"2",viewValue:"Offer 2"},
           {value:"3",viewValue:"Offer 3"},
           {value:"4",viewValue:"Offer 4"}
        ];
        osBaseSku = [
        {value:"1",viewValue:"Sku 1"},
        {value:"1",viewValue:"Sku 2"},
        {value:"1",viewValue:"Sku 3"},
        {value:"1",viewValue:"Sku 4"}
        ];


        @Output() selectedCloudEnv = new EventEmitter();
        repository: Array<any> = [
        {
            name: "Domino's",
            provider: "Github",
            access: "http://github.com/futur/project-world",
            stack: "Mobile App Stack"
        },
        {
            name: "Tireoh",
            provider: "Github",
            access: "http://github.com/futur/project-world",
            stack: "little"
        }
                                ];

        constructor(private router: Router, private _formBuilder: FormBuilder, public dialog: MdDialog, private httpService: API,
        private storeService: StoreService, public toastr: ToastsManager, public renderer: Renderer) {
        var self = this;


        // setTimeout(() => {
        //     this.btElem = document.getElementsByClassName('md-ripple-background');
        //     console.log("list of tabs", this.btElem);
        //     // renderer.listen(this.btElem, 'click', (event) => {
        //     //  this.ftUser = true;
        //     // })
        // }, 1000);


        this.azureDetail = this._formBuilder.group({
            name: ['', [Validators.required]],
            vnetSelect: ['', [Validators.required]],
            subnetSelect: ['',[Validators.required]],
            vmSelect1: ['', [Validators.required]],
            vmSelect2: ['', [Validators.required]],
            resourcegrp: ['', [Validators.required]],
            storageAccountSelect: ['', [Validators.required]],
            storageAccountRadio: ['', [Validators.required]],
            osBase: ['', [Validators.required]],
            osBasePublish: ['', [Validators.required]],
            osBaseOffer: ['',[Validators.required]],
            osBaseSku: ['',[Validators.required]],            
            diskCount:['',[Validators.required]],
            diskSelect:['',[Validators.required]],
            ipAddress:['',[Validators.required]],
            nsgSelect:['',[Validators.required]]

        })

    }

    ngOnInit() {
        var self = this;
        self.serviceIndex = 0;//Modified By Harsh

    }

    ngAfterViewInit() {
        var self = this;
        // self.contWidth = document.getElementsByClassName('bundle-content')[0].clientWidth - 5;
        var elem = document.querySelector('.bundle-tab-container');
        self.contWidth = (elem.clientWidth) - 50;
        self.serviceIndex = 0;//Modified By Harsh
    }

    cloudEnvUpdate(value){
        console.log(value);
        this.selectedCloudEnv.emit(value);
        this.selectedAzureVendor = value;
        console.log("checking heree correct");
        console.log(this.selectedAzureVendor);  
    }

     maxRange() {
        if (this.diskCount >= 15) {
            return false;
        }
        else {
            this.diskCount++;
            this.disks = Array(this.diskCount).fill(null);
        }
    }

    minRange() {
        if (this.diskCount <= 0) {
            return false;
        }
        else {
            this.diskCount--;
            this.disks = Array(this.diskCount).fill(null);
        }
    }

    

    disCountClick() {
        this.showDisk1 = true;
        this.elasticIpshow = false;
    }

    onSelectChange = ($event: any): void => {
   console.log('event => ', $event);
   console.log('index => ', $event.index);
   if($event.index == 0)
   {
       this.serviceIndex = 0;
       this.ftUser = false;
   }
   
   else
  {
      this.serviceIndex = 1;
      this.ftUser = true;
  } 

 }




}


