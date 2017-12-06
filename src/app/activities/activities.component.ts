import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './activities.html',
    styleUrls: ['../main.scss']
})

export class ActivitiesComponent implements AfterViewInit {
    flag: String = 'five';
    /*Layout Structure Width and Height start here*/
    resWidth: Number = window.innerWidth - 75;
    resHeight: Number = window.innerHeight - 145;
    userHeight: Number = window.innerHeight - 260;
    roleHeight: Number = window.innerHeight - 335;
    actHeight: Number;
    activitiesIndex: Number;
    removeRole: Boolean = false;
    searchExp: Boolean = false;
    constructor(private router: Router) { }
    onSearchExp() {
        this.searchExp = !this.searchExp;
    }
    actItem = [
        {
            name: 'aaa',
            time: '6.50 PM',
            status: 'passed'
        },
        {
            name: 'bbb',
            time: '11.50 AM',
            status: 'failed'
        },
        {
            name: 'ccc',
            time: '1.50 PM',
            status: 'passed'
        },
        {
            name: 'ooo',
            time: '1.50 PM'
        },
        {
            name: 'vvv',
            time: '1.50 PM'
        }

    ]
    ngAfterViewInit() {
        var self = this;
        self.activitiesIndex = 0;
        const scrollHeight = ((window.innerHeight - 165) - (document.getElementById('act-scroll-height').clientHeight))-15;
        self.actHeight = scrollHeight;
        console.log('actHeight', self.actHeight);
    }
}