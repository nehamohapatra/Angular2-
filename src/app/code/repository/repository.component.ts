import { Component, AfterViewInit, ViewChild, Renderer, Output, EventEmitter } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { scmConnect } from '../../common/repository';
import * as _ from 'lodash';
import { BuildTestComponent } from '../build-test/build-test.component';
//Componet dependencies
@Component({
    templateUrl: './repository.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService]
})

//Component logic container class

export class CodeComponent implements AfterViewInit {

    classValue: String;
    flag: String = 'three'
    deployTab: Boolean = false;
    searchExp: Boolean = false;
    resHeight: Number = window.innerHeight - 146;
    termTop: number = 150;
    linkTop: number = 150;
    nodataTop: number = 150;
    unlinkPop: Boolean = false;
    onLinkRepo: Boolean = false;
    selectedBundle: Number;
    selectedStack: Number;
    enableNext: Boolean = false;
    resWidth: Number = window.innerWidth - 75;
    contWidth: Number;
    nameFlag: Boolean = true;
    sortName: String = "name";
    scmArray: Array<any> = [];
    repoArray: Array<any> = [];
    selectedRepo: String = '';
    selectedSCM: String = '';
    showProgress: Boolean = false;
    showBorder: Boolean = false;
    bsTab: Boolean = false;
    ftUser: Boolean = false;
    ftRepo: Boolean = false;
    selectIndex: Number;
    buildTest: Boolean = false;
    providerFlag: Boolean = true;
    stackFlag: Boolean = true;
    showTableValue: Boolean = false;
    showArrowOne: Boolean = true;
    showArrowTwo: Boolean = false;
    showArrowThree: Boolean = false;
    detailLoader: Boolean = false;
    noBorder: Boolean = false;
    selectedItem: String = null;
    manageLoader: Boolean = false;
    currentProject: String = "";
    githubSuccessMsg: String = undefined;
    rotateRefresh: Boolean = false;
    bundles: any;
    manageTitle: [String] =["","Repository","Build","Something"]

    //Element
    mainBSTab: any;
    tabElem: any;
    bsElem: any;
    btElem: any;
    thirdElem: any;

    @ViewChild('buildTest') buildTestComponent: BuildTestComponent

    filter(name) {
        if (name.indexOf('name') != -1) {
            this.nameFlag = !this.nameFlag
            this.showArrowOne = true;
            this.showArrowTwo = false;
            this.showArrowThree = false;
            this.sortName == 'name' ? this.sortName = '!name' : this.sortName = 'name';
        }
        else if (name.indexOf('type') != -1) {
            this.showArrowOne = false;
            this.showArrowTwo = true;
            this.showArrowThree = false;
            this.providerFlag = !this.providerFlag
            this.sortName == 'type' ? this.sortName = '!type' : this.sortName = 'type';
        }
        else {
            this.showArrowOne = false;
            this.showArrowTwo = false;
            this.showArrowThree = true;
            this.stackFlag = !this.stackFlag
            this.sortName == 'stack' ? this.sortName = '!stack' : this.sortName = 'stack';
            console.log(this.sortName)
        }

    }
    onRefreshClick() {
        let self = this
        // this.rotateRefresh = true;
        // self.rotateRefresh = false;
        self.rotateRefresh = true;
        self.syncRepos();
        self.listBuilds();
        self.repoList();
    }
    buildSuccessClick() {
        this.selectedItem = "2";
        this.selectMng();
        this.tabElem.click()
    }

    createLinkRepo(){
        this.bundles.click();
    }

    constructor(public toastr: ToastsManager, private renderer: Renderer, private storeService: StoreService, private activatedRoute: ActivatedRoute, private httpService: API, private router: Router) {
        setTimeout(() => {
            this.mainBSTab = <HTMLElement>document.getElementsByClassName('md-ripple-background')[0];
            this.tabElem = document.getElementsByClassName('md-ripple-background')[1];
            this.thirdElem = <HTMLElement>document.getElementsByClassName('md-ripple-background')[2];
            this.bsElem = document.getElementsByClassName('md-ripple-background')[4];
            this.bundles = document.getElementsByClassName('md-ripple-background')[3];
            this.btElem = document.getElementsByClassName('md-ripple-background')[5];
             console.log("this.btElem", this.btElem);
            //    this.mainBSTab.click()

            renderer.listen(this.bundles, 'click', (event) => {
                this.router.navigate(['code']);
            })
            renderer.listen(this.mainBSTab, 'click', (event) => {
                this.router.navigate(['code']);
                this.showBorder = false;
                this.classValue = "";
                this.buildTest = false;
            })
            renderer.listen(this.tabElem, 'click', (event) => {
                // this.syncRepos();
                this.repoList();
                this.currentDetail = '';
            })
            renderer.listen(this.bsElem, 'click', (event) => {
                this.showBorder = false;
                this.router.navigate(['code']);
                this.buildTest = false;
                this.buildTestComponent.loadData();
            })
            renderer.listen(this.btElem, 'click', (event) => {
                this.buildTestComponent.loadData();
            })

            //self.updateData(false);
            scmConnect(this, false, false);
        }, 1000)


        router.events.subscribe((val) => {
            if (val.url == "/code") {
                this.showBorder = false;
                // this.bsTab = false;
            }

            else if (val.url == "/code/create-repository") {
                this.showBorder = true;
                // this.bsTab = true;
            }

            else {
                this.showBorder = true;
            }

        })
    }
    selectRepository: Boolean = false;
    selectBuild: Boolean = true;
    selectMng() {
        console.log('select repository', this.selectedItem);
        if (this.selectedItem == '1') {
            console.log('1');
            this.selectRepository = false;
            this.selectBuild = true;
        }
        else if (this.selectedItem == '2') {
            console.log('2');
            // TODO: Ucomment next lines
            this.listBuilds();
            this.selectRepository = true;
            this.selectBuild = false;
        }
        else {
            console.log('others');
        }
    }
    repoHeight: Number = (window.innerHeight - 190) - 110;
    contHeight: Number = ((window.innerHeight - 190) - 110) - 22;


    gitHub: Boolean = false;

    onGithubClick() {
        this.gitHub = true;
        let self = this;
        let url = "v1/auth/github";
        self.httpService.fetchData('get', url, function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        }, {});
        this.toastr.success('Github successfully linked', null, { animate: 'fade', toastLife: 3000 });
    }

    /*Repository Dummy Data*/
    tbody: Boolean = false;
    noData: Boolean = false;
    linkRepos: Boolean = true;
    uncompData: Boolean = false;
    compData: Boolean = false;
    repoLink: Boolean = false;
    showLoad: Boolean = true;
    repoDetail: any;
    detailHeight: Number = (window.innerHeight - 190) - 311;
    tableSearch: any;
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
    ]
    empty: any = []
    public currentDetail;

    // repoClick(repoItem) {
    //     this.currentDetail = repoItem;
    //     if (this.currentDetail.name == '' || this.currentDetail.provider == '' || this.currentDetail.access == '' || this.currentDetail.stack == '') {
    //         this.uncompData = true;
    //         this.compData = false;
    //     }
    //     else {
    //         this.compData = true;
    //         this.uncompData = false;
    //     }

    // }
    /*End Here*/

    repoClick(repoItem) {
        this.currentDetail = repoItem;
        let self = this;
        let url = 'v1/github/getRepoDetails'
        self.detailLoader = false;
        //To check user connected with gitHub
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            self.repoDetail = data.data;
            self.detailLoader = true;
            console.log("Repo Details are", self.repoDetail);
        }, function (err) {
            console.log('error', err);
            alert("Error" + err.statusCode)
            console.log("Error Getting List of CodeStacks", err);
            // self.toastr.error('Error Getting List of CodeStack', null, { animate: 'fade', toastLife: 3000 })
        }, { text: '&repo=' + self.currentDetail.name });



        if (this.currentDetail.name == '' || this.currentDetail.provider == '' || this.currentDetail.access == '' || this.currentDetail.stack == '') {
            this.uncompData = true;
            this.compData = false;
        }
        else {
            this.compData = true;
            this.uncompData = false;
        }

    }


    onBuildClick() {
        console.log("Fired")
        this.router.navigate(['code'])
    }

    changedHost(scm) {
        console.log("selected SCM", scm)
        let self = this;
        self.selectedSCM = scm
        let hostName = self.scmArray.map(function (key, index) {
            console.log(key);
            if (key._id == scm) {
                return key.type
            }
        })
        self.showProgress = true
        self.httpService.fetchData('get', 'v1/' + hostName + '/listRepo', function (data) {
            data = data.json();
            console.log("Repo Array", data.message);
            self.repoArray = data.message;
            self.showProgress = false
        }, function (err) {
            console.log("Error Getting Repo list", err);
            //self.toastr.error('Error Getting Repo list', null, { animate: 'fade', toastLife: 3000 })
            self.showProgress = false
        }, {});
    }
    deployClick() {
        this.deployTab = false;
        this.classValue = undefined;
    }
    onSearchExp() {
        document.getElementById('tableSearch').click()
        this.searchExp ? this.searchExp = false : this.searchExp = true;
        this.tableSearch = "";
    }
    onunlinkClick() {
        this.unlinkPop = !this.unlinkPop;
    }
    onLinkRepoClick() {
        this.onLinkRepo = !this.onLinkRepo;
        //this.ftUser = !this.ftUser;
        //this.ftRepo = !this.ftRepo;
        this.selectedSCM = "";
        this.selectedRepo = "";
        //this.noBorder = !this.noBorder;
    }
    onRepoLinkClick() {
        this.repoLink ? this.repoLink = false : this.repoLink = true
    }
    onUnlinkYes() {
        let self = this;
        let url = 'v1/repo/unlink';
        let payload = { name: self.repoDetail.name, scmAccountId: self.repoDetail.scmAccId };
        self.httpService.fetchData('post', url, function (data) {
            data = data.json()
            if (data && data.success) {
                console.log(data);
                self.repoList();
                self.currentDetail = false;
                self.repoLink = false;
                self.toastr.success(self.repoDetail.name + ' successfully unlinked', null, { animate: 'fade', toastLife: 3000 });
            }
        }, function (err) {
            err = err.json()
            console.log("Error Creating New Repo", err)
            self.repoLink = false;
            self.currentDetail = false;
            self.toastr.error(self.repoDetail.name + ' could not be unlinked', null, { animate: 'fade', toastLife: 3000 })
        }, payload);

    }
    repoList() {
        let self = this;
        // self.manageLoader = true;
        //let pId = Cookie.get('projectId')
        let pId = localStorage.getItem('pId');
        let url = 'v1/project/getProjectRepos/' + pId;
        //To check user connected with gitHub
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            if (data.data.length != 0) {
                self.showTableValue = true;
                self.noData = false;
                console.log("Done!!!");
            }
            else {
                self.noData = true;
            }
            // self.repository = data.data;
            // console.log(data.data);
            var repoListArray = data.data
            for (var i = 0; i < repoListArray.length; i++) {
                if (repoListArray[i].stack == undefined) {
                    repoListArray[i].stack = ""
                    console.log(repoListArray[i])
                }
            }
            self.repository = repoListArray;
            // self.manageLoader = false;

            self.showSearch();
        }, function (err) {
            // self.manageLoader = false;
            console.log("Error Getting List of CodeStacks", err);
            // self.toastr.error('Error Getting List of CodeStack', null, { animate: 'fade', toastLife: 3000 })
        }, {});
    }

    changeProEvent() {
        var self = this;
        self.updateData(true);
        scmConnect(self, true);
        // self.syncRepos();
        this.repoList();
        self.getProject()
    }

    getScmAccounts() {
        var self = this;
        const pid = this.storeService.getStore('project').id
        this.httpService.fetchData('get', 'v1/SCMAccounts/get', function (data) {
            data = data.json();
            let thirdParty = data.data;

            //set thirdParty scm to store
            self.storeService.setStore('scmAccount', {
                scmAccounts: thirdParty,
                pId: pid
            })

        }, function (err) {
            console.log(err);
        }, {});
    }

    onLinkRepoSubmitClick() {
        let self = this
        console.log(self.selectedRepo)
        let repoName = null;
        let repoURL = null;
        self.repoArray.map(function (key, index) {
            console.log(key);
            if (key.id == self.selectedRepo) {
                repoName = key.name;
                repoURL = key.clone_url;
            }
        })
        let payload = { "name": repoName, "repoURL": repoURL, "scmId": self.selectedSCM }
        console.log("onLinkRepoSubmitClick", payload);
        self.httpService.fetchData('post', 'v1/github/linkRepo', function (data) {
            data = data.json()
            if (data && data.success) {
                self.onLinkRepoClick();
                self.toastr.success(repoName + ' successfully linked', null, { animate: 'fade', toastLife: 3000 })
                let elem = <HTMLElement>document.getElementsByClassName('md-ripple-background')[1]
                elem.click();
                self.noData = false;
                self.noBorder = !self.noBorder;
                self.selectedSCM = "";
                self.selectedRepo = "";
            } else if (!data.success) {
                self.onLinkRepoClick();
                self.toastr.error(data.message, null, { animate: 'fade', toastLife: 3000 })
            }
        }, function (err) {
            err = err.json()
            console.log("Error Creating New Repo", err)
            self.toastr.error(repoName + ' could not be linked', null, { animate: 'fade', toastLife: 3000 })
        }, payload);
    }
    updateData(value) {
        var self = this;

        self.httpService.fetchData('get', 'v1/SCMAccounts/get', function (data) {
            data = data.json();
            self.scmArray = data.data;
            if (self.scmArray.length == 0) {
                self.ftUser = true;
                self.bsTab = true;
                self.selectIndex = 2;
            }
            else {
                if (!value) {
                    self.activatedRoute.queryParams.subscribe(
                        (param: any) => {
                            if (param['msg'] != undefined) {
                                self.selectIndex = 2;
                            }
                            else {
                                self.selectIndex = 0;
                            }
                        });
                }
                self.bsTab = false;
                self.ftUser = false;
            }
        }, function (err) {
            console.log("Error Getting SCM Details", err);
            // self.toastr.error('Error Getting SCM Details', null, { animate: 'fade', toastLife: 3000 })
        }, {});
    }
    showSearch() {
        var self = this;
        self.noData = false;
        if (this.repository.length == 0) {
            self.noData = true;
        }
        this.tbody = false;
        if (this.repository.length > 3) {
            this.tbody = true;
        }
    }
    onScmUnlink() {
        var self = this;
        self.updateData(false);
        scmConnect(self, false, false);
    }
    syncRepos() {
        var self = this;
        // self.manageLoader = true;
        self.httpService.fetchData('get', 'v1/project/syncRepoList', function (data) {
            data = data.json();
            if (data && data.success) {
                console.log("Repos sync success", data);
            } else if (data && !data.success) {
                //  self.toastr.error('Error in syncing Repositories', null, { animate: 'fade', toastLife: 3000 });
            }
            self.repoList();
            self.rotateRefresh = false;
        }, function (err) {
            self.rotateRefresh = false;
            console.log(err);
            self.repoList();
            // self.toastr.error('Error in syncing Repositories', null, { animate: 'fade', toastLife: 3000 })
        }, {});
    }
    listBuilds() {
        var self = this;
        // self.manageLoader = true;
        self.httpService.fetchData('get', 'v1/buildAndTest/listBuilds', function (res) {
            res = res.json();
            if (res.data.length > 0 && res.success) {
                self.buildItem = _.orderBy(res.data, ['timestamp'], ['desc']);
                console.log("Listed Builds:", res);
            } else {
                // self.toastr.error('Error in getting builds', null, { animate: 'fade', toastLife: 3000 });
                console.log("list build err");
            }
            // self.manageLoader = false;
        }, function (err) {
            console.log(err);
            // self.manageLoader = false;
            // self.toastr.error('Error in syncing Repositories', null, { animate: 'fade', toastLife: 3000 });
        }, {});
    }
    getProject() {
        var projectList = this.storeService.getStore('project').projectList;
        var currentId = this.storeService.getStore('project').id;
        var currentProject = projectList[_.indexOf(projectList, _.find(projectList, { _id: currentId }))]
        // this.storeService.setStore('currentProject',{data:currentProject})
        this.currentProject = currentProject.name;
    }
    ngAfterViewInit() {

        let self = this
        //self.updateData(false)        
        self.repoList()
        // self.listBuilds();
        self.contWidth = document.querySelector('.bundle-tab-container').clientWidth - 30

        const termWrap = document.getElementsByClassName('terms-wrap')[0];
        const fullHeight = window.innerHeight / 2;
        const termTop = fullHeight - termWrap.clientHeight / 2;
        self.termTop = termTop;

        const linkWrap = document.getElementsByClassName('project-cont')[0];
        const linkTop = (linkWrap.clientHeight - termWrap.clientHeight) / 2;
        self.linkTop = linkTop;

        const nodataTop = (linkWrap.clientHeight - 153)
        self.nodataTop = nodataTop;

        self.activatedRoute.queryParams.subscribe(
            (param: any) => {
                self.githubSuccessMsg = param['msg']
            });

    }
    public buildItem = [
        // {
        //     period: '20-Nov-2016 10:00 PM',
        //     acname: 'aws-account',
        //     status: 'passed'
        // },
        // {
        //     period: '19-Nov-2016 10:00 PM',
        //     acname: 'azure-account',
        //     status: 'stopped'
        // },
        // {
        //     period: '18-Nov-2016 10:00 PM',
        //     acname: 'gsp-account',
        //     status: 'failed'
        // },
        // {
        //     period: '17-Nov-2016 10:00 PM',
        //     acname: 'aws-account',
        //     status: ''
        // }
    ]
}

