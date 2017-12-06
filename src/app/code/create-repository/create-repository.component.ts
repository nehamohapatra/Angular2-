import { Component, OnInit, Output,AfterViewInit, EventEmitter, Input } from '@angular/core';
import { API } from '../../http/http.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router, ActivatedRoute } from '@angular/router';
const appConfig = require('../../../../appConfig.js');
import { StoreService } from '../../services/store.service';
import { scmConnect } from '../../common/repository';

//Componet dependencies
@Component({
    selector: 'create-repository',
    templateUrl: './create-repository.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService]
})

//Component logic container class

export class CreateRepositoryComponent{

    @Output() unLink: EventEmitter<any> = new EventEmitter<true>();

    contHeight: Number = window.innerHeight - 180;
    ownerDetails: Object = {};
    githubSuccessMsg: String = undefined;
    contWidth: Number;
    unlinkPop: Boolean = false;

    //TODO : Use "selectedRepo" to set the selected repo dynamically.
    //selectedRepo: String = null;
    selectedRepo: String = 'github';

    constructor(public toastr: ToastsManager, private storeService: StoreService, private activatedRoute: ActivatedRoute, private httpService: API) {
         scmConnect(this, true);
    }
    gitHub: Boolean = false;
    selectedId: String = '';
    onGithubClick() {
        let pId = this.storeService.getStore('project').id
        let url = "connect/v1/github?X-DFP-Token=" + localStorage.getItem('token') + "&pId=" + pId;
        //let baseUrl = "http://localhost:9090/";
        let finalUrl = appConfig.baseUri + url;
        window.location.href = finalUrl;
        // this.toastr.success('Github successfully linked', null, { animate: 'fade', toastLife: 3000 });
    }

    onunlinkClick() {
        this.unlinkPop = !this.unlinkPop;
    }
    onunlinkConfirmClick() {
        const repoProvider = this.selectedRepo;
        console.log(repoProvider);
        if (!repoProvider) {
            console.log("Could not find the repoProvider :", repoProvider)
            return;
        }
        var self = this;
        this.httpService.fetchData('post', 'v1/' + repoProvider + '/unlinkAccount', function (data) {
            // data = data.json();
            // let thirdParty = data.data;
            self.unLink.emit()
            self.toastr.success(repoProvider + ' account successfully unlinked', null, { animate: 'fade', toastLife: 3000 })
            //self.onunlinkClick();
            self.unlinkPop = false;

            //self[repoProvider] = false // Set this bool dynamically
            self.gitHub = false;

            //Clear the Unlinked repo from the Store (move the code below to a service/function)
            //identify SCM with the .type and delete that object from the scmAccountsArray
            //Set the "scmAccount" back to store.
            const scmStore = self.storeService.getStore('scmAccount').scmAccounts;
            console.log("scmStore", scmStore);
            for (let i in scmStore) {
                if (scmStore[i].type == repoProvider) {
                    scmStore.splice(i, 1);
                }
            }
            self.storeService.setStore('scmAccount', {
                scmAccounts: scmStore
            })

        }, function (err) {
            console.log(err);
            // self.toastr.error('Something went south', null, { animate: 'fade', toastLife: 3000 })
            self.toastr.error('GitHub not be unlinked. Please retry', null, { animate: 'fade', toastLife: 3000 })
            self.unlinkPop = false;
        }, { scmId: self.selectedId });

    }
    // childEvent() {
    //     //this.scmConnect();
    //     scmConnect(this);
    // }
    updateData() {
        scmConnect(this, true);
    }

    ngAfterViewInit() {
        //To check user connected with gitHub
        var self = this;
        setTimeout(() => {
            self.contWidth = document.querySelector('.deploy-content-container').clientWidth - 1
        })

        self.activatedRoute.queryParams.subscribe(
            (param: any) => {
                self.githubSuccessMsg = param['msg']
            });

       

    }

}

