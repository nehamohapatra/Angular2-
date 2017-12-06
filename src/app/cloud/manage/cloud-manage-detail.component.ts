import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//Componet dependencies
@Component({
    selector: 'cloud-manage-detail',
    templateUrl: './cloud-manage-detail.html',
    styleUrls: ['../../main.scss']
})

//Component logic container class

export class CloudManageDetailComponent implements AfterViewInit {
    contWidth: Number;
    searchExp: Boolean = false;
    tbody: Boolean = false;
    noData: Boolean = false;
    uncompData: Boolean = false;
    compData: Boolean = false;
    repoLink: Boolean = false;
    repoDetail: any;
    detailHeight: Number = (window.innerHeight - 190) - 311;
    vmModel: Boolean = false;
    vmStop: Boolean = false;
    vmTerminate: Boolean = false;

    constructor(private router: Router) { }

    onSearchExp() {
        this.searchExp ? this.searchExp = false : this.searchExp = true;
        this.tableSearch = "";
    }
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
    repoClick(repoItem) {
        this.currentDetail = repoItem;
        if (this.currentDetail.name == '' || this.currentDetail.provider == '' || this.currentDetail.access == '' || this.currentDetail.stack == '') {
            this.uncompData = true;
            this.compData = false;
        }
        else {
            this.compData = true;
            this.uncompData = false;
        }

    }
    onStop() {
        this.vmModel = !this.vmModel;
        this.vmStop = !this.vmStop;
    }
    onTerminate() {
        this.vmModel = !this.vmModel;
        this.vmTerminate = !this.vmTerminate;
    }
    ngAfterViewInit() {
        let self = this;
        var elem = document.querySelector('.bundle-tab-container');
        self.contWidth = (elem.clientWidth) - 50;
    }
}