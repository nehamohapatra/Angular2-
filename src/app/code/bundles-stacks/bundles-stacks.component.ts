import { Component, OnInit, Pipe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { InputFilter } from '../../services/query.service';
import { API } from '../../http/http.service';

//Componet dependencies
@Component({
    templateUrl: './bundles-stack.html',
    styleUrls: ['../../main.scss'],
    providers: [InputFilter, API]
})

//Component logic container class

export class BundlesAndStackComponent implements OnInit {
    classValue: String;
    flag: String = 'three'
    deployTab: Boolean = false;
    searchExp: Boolean = false;
    resHeight: Number = window.innerHeight - 190;
    termTop: number = 150;
    unlinkPop: Boolean = false;
    selectedBundle: Number;
    selectedStack: Number;
    selectedItem: Number;
    enableNext: Boolean = false;
    filter: any;
    deployLoader: Boolean = true;
    constructor(private router: Router,
        private httpService: API,
        public toastr: ToastsManager, ) {

    }

    deploy: Array<any> = [];
    repoHeight: Number = (window.innerHeight - 190) - 110;
    contHeight: Number = (((window.innerHeight - 190) - 63) - 22) - 20;
    loaderHeight: Number = ((((window.innerHeight - 190) - 63) - 22) - 20)-115;
    contWidth: Number;

    //Selected bundle and stack
    selectBundle(flag, selectedID) {
        this.selectedStack = null;
        this.selectedItem = selectedID;
        this.selectedBundle = flag;
        this.enableNext = true;
    }
    checkFlag(flag) {
        return this.selectedBundle == flag ? "active" : "";
    }
    selectStack(flag, selectedID) {
        this.selectedBundle = null;
        this.selectedItem = selectedID;
        this.selectedStack = flag;
        this.enableNext = true;
    }
    testFlag(flag) {
        return this.selectedStack == flag ? "active" : ""
    }
    onSearchExp() {
        var elem = document.getElementById('bundlesSearch');
        elem.click()
        this.searchExp ? this.searchExp = false : this.searchExp = true;
        this.filter = undefined
    }
    onDeployDetails() {
        var self = this;
        let url = 'v1/master/codestack'
        self.deployLoader = true;
        //To check user connected with gitHub
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            console.log("codeStack", data.data);
            self.deploy = data.data;
            self.deployLoader = false;
        }, function (err) {
            console.log("Error Getting List of CodeStacks", err);
            //self.toastr.error('Error Getting List of CodeStack', null, { animate: 'fade', toastLife: 3000 })
        }, {});
    }
    ngOnInit() {
        var self = this;
        setTimeout(() => {
            self.contWidth = document.querySelector('.deploy-content-container').clientWidth - 1
        })
        self.onDeployDetails();
    }
    onNextClick() {
        this.router.navigate(['code/link-repository'], { queryParams: { "packageID": this.selectedItem } });
    }
}