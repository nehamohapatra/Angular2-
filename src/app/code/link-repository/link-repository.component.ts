import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
// import { scmConnect } from '../../common/repository';

//Componet dependencies
@Component({
    templateUrl: './link-repository.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService]
})

//Component logic container class

export class LinkRepositoryComponent implements OnInit {
    contHeight: Number = ((window.innerHeight - 190) - 63) + 6;
    contWidth: Number;
    packageDetails: any;
    scmArray: Object = [];
    selectedSCM: String;
    newRepoName: String = '';
    launchRepo: FormGroup;
    scmTool: any;
    noData: Boolean = false;
    passwordError: String = "Name can't be blank";
    showBundleDetails: Boolean = false;
    launchDisable: Boolean;
    alreadyDeploy: Boolean = false;
    repositoryName: String;
    yourRepo: String;

    constructor(private router: Router,
        private httpService: API,
        public toastr: ToastsManager,
        private elem: ElementRef,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private storeService: StoreService,
        private _location: Location) {

    }
    changeName() {
        var regexWhole = /^[a-zA-Z0-9_.-]*$/;
        if (this.launchRepo.value.repoName.length > 3) {
            if (!regexWhole.test(this.launchRepo.value.repoName)) {
                this.passwordError = "Name should contain only allowed characters"
            }
            else
                this.passwordError = ""
        }
        else
            this.passwordError = "Name should be 3 to 30 letters"
    }

    onNextClick() {
        let self = this;
        self.launchDisable = true;
        let pid = this.storeService.getStore("project").id || null;
        console.log("Launh Click")
        //Construct the Body
        //Call API , on Success do the Navigation
        let body = { "name": self.launchRepo.value.repoName, "codeStackId": self.packageDetails.ID, "projectId": pid, "scmId": self.launchRepo.value.selectRepo }
        console.log("Launch Click", body);
        self.httpService.fetchData('post', 'v1/github/createRepo/', function (data) {
            data = data.json()
            if (data && data.success) {
                let elem = <HTMLElement>document.getElementsByClassName('md-ripple-background')[1]
                elem.click();
                self.noData = false;
                self.toastr.success(self.launchRepo.value.repoName + ' successfully deployed', null, { animate: 'fade', toastLife: 3000 })
                //self.router.navigate(['project-landing']); 
                self.launchDisable = false;
            }
        }, function (err) {
            err = err.json()
            console.log("Error Creating New Repo", err);
            self.launchDisable = false;
            self.alreadyDeploy = true;
            self.repositoryName = self.launchRepo.value.repoName + ' has already been created';
            setTimeout(() => {
                self.alreadyDeploy = false;
                self.yourRepo = '';
            }, 3000);
            //self.toastr.error(self.launchRepo.value.repoName + ' deployment was unsuccessful', null, { animate: 'fade', toastLife: 3000 })
        }, body);
    }
    onBackClick() {
        this._location.back();
    }
    ngOnInit() {
        let self = this;
        let packageID = null;

        let packageIDparam = self.activatedRoute.queryParams.subscribe(
            (param: any) => {
                if (param['packageID'] && param['packageID'] > 0)
                    packageID = param['packageID']
                else
                    self.toastr.error('Oops, No Package Selected', null, { animate: 'fade', toastLife: 3000 })
            });

        //Check the package ID
        //Get the package Details and Populate the model
        //Get the list of scm providers and populate the DL
        self.httpService.fetchData('get', 'v1/master/codestack/' + packageID, function (data) {
            data = data.json();
            console.log("Package Details", data.data[0]);
            self.packageDetails = data.data[0];
            if (self.packageDetails.name === "EMPTY") {
                self.showBundleDetails = false;
            } else {
                self.showBundleDetails = true;
            }
        }, function (err) {
            console.log("Error Getting Selected Package Details", err);
            self.toastr.error('Error Getting Selected Package Details', null, { animate: 'fade', toastLife: 3000 })
        }, {});

        //Getting List of Allowed SCM for DDL
        //TODO Send projectID with the API below
        self.httpService.fetchData('get', 'v1/SCMAccounts/get', function (data) {
            data = data.json();
            console.log("SCM Array", data.data);
            self.scmArray = data.data;
            setTimeout(() => {
                // self.scmTool = self.scmArray[0]._id;
                self.launchRepo.controls['selectRepo'].setValue(self.scmArray[0]._id); //Setting first Value as selected
            });
        }, function (err) {
            console.log("Error Getting SCM Details", err);
            self.toastr.error('Error Getting SCM Details', null, { animate: 'fade', toastLife: 3000 })
        }, {});
        //scmConnect(self);

        setTimeout(() => {
            self.contWidth = document.querySelector('.deploy-content-container').clientWidth - 1
        })
        var regExp = /^[a-zA-Z0-9_.-]*$/
        this.launchRepo = this._formBuilder.group({
            repoName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExp)]],
            selectRepo: ['', [Validators.required]]
        })
    }
}

