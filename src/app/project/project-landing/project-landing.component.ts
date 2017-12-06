import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { scmConnect } from '../../common/repository';
import { API } from '../../http/http.service';
const appConfig = require('../../../../appConfig.js');
import { StoreService } from '../../services/store.service';
import * as _ from 'lodash';
//import { UiSwitchModule } from 'angular2-ui-switch';




@Component({
    templateUrl: './project-landing.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService]

})


export class ProjectLandingComponent implements OnInit {
    flag: String = 'one';
    gitHub: Boolean = false;
    scmTools: Array<any> = [];
    parentCol: Number;
    codeCol: Number;
    cloudCol: Number;
    cloudSpan: Number;
    utilSpan: Number;
    //  commitCount:Number = 0;
    utilCol: Boolean = false;
    connectDfp: Boolean = false;
    doMore: Boolean = false;
    DfpStatus: Boolean = false;
    pageSwitch: Boolean = true;
    stoppedAmount: number = 0;
    runningAmount: number = 0;
    totalInstancesCountArray: Array<number> = [0, 0];
    reservationsData: any;
    donutChartOptions: any;
    costChartOptions: any;
    totalInstancesCount: number = 0;
    datesInMonth: any;
    //costChartOptions: any;

    selectedSCM: String = '';
    scmArray: Array<any> = [];
    showProgress: Boolean = false;
    repoArray: Array<any> = [];
    dfpLinkRepos: Array<any> = [];
    selectedRepo: string = '';
    avgCommitsCount: number = 0;
    showLoadChart1: Boolean = false;
    showLoadChart2: Boolean = false;
    showLoadChart3: Boolean = false;
    selectedInstance: any = 'aws';
    perDayToggle: Boolean = true;
    noOfDaysInMonthsArray: Array<any> = [];
    monthNameArray: Array<any> = [];
    cpuUtilChartOptions: any;
    gitHubCommitsArray: Array<any> = [];

    cloudCostResponse: any;

    
    vmUsageChartOptions = {
        chartType: 'ColumnChart',
        dataTable: [
            ['Month', 'Cost in thousand', { role: 'annotation' }],
            [{ v: 1, f: '0-10%' }, 10, '10%'],
            [{ v: 2, f: '10-20%' }, 30, '30%'],
            [{ v: 3, f: '20-30%' }, 8, '8%'],
            [{ v: 4, f: '30-40%' }, 10, '10%'],
            [{ v: 5, f: '40-50%' }, 20, '20%'],
            [{ v: 6, f: '50-60%' }, 10, '10%'],
            [{ v: 7, f: '60-70%' }, 7, '7%'],
            [{ v: 8, f: '70-80%' }, 8, '8%'],
            [{ v: 9, f: '80-90%' }, 9, '9%'],
            [{ v: 10, f: '90-100%' }, 5, '5%']
        ],
        options: {
            'focusTarget': 'category',
            'axisTitlesPosition': 'none',
            'annotations': {
                'alwaysOutside': true,
                'textStyle': {
                    'fontSize': 26,
                    'color': 'white'
                }
            },
            'tooltip': { 'isHtml': true },
            'title': 'Tasks',
            'bar': {
                'groupWidth': '100%'
            },
            'backgroundColor': {
                'fill': 'none',
                'stroke': 'black'
            },
            'chartArea': {
                'width': '100%',
                'height': '100%'
            },
            'colors': ['#fb6c78'],
            'enableInteractivity': true,
            'hAxis': {
                'gridlines': {
                    'color': '#4b5346',
                    'count': 10
                },
                'textPosition': 'none',
                'titleTextStyle': {
                    'color': 'black',
                    'fontSize': 13,
                    'bold': true
                }
            },
            'vAxis': {
                'gridlines': {
                    color: 'transparent'
                },
                'format': 'currency',
                'textPosition': 'none',
                'maxValue': 25
            },
            'width': 627,
            'height': 245,
            'axes': {
                'x': {
                    0: { 'side': 'top', 'label': 'my x axis' }
                },
                'y': {
                    0: { 'side': 'left', 'label': 'my y axis' }
                }
            }
        },
    };
    constructor(public toastr: ToastsManager, private router: Router, private httpService: API, private storeService: StoreService) {
    }


    onSwitch() {
        //console.log("onSwitch Click: ", this.pageSwitch);

    }
    onGithubClick() {
        var self = this;
        self.gitHub = true;
        let pId = self.storeService.getStore('project').id
        let token = localStorage.getItem('token')
        let url = "connect/v1/github?X-DFP-Token=" + token + "&pId=" + pId;
        let finalUrl = appConfig.baseUri + url;
        window.location.href = finalUrl;
    }

    changePro() {
        let self = this;
        self.getUserTools();
        self.getAllSCM();
    }

    getAllSCM() {
        let self = this;
        let url = 'v1/master/scm'
        //To check user connected with gitHub
        self.httpService.fetchData('get', url, function (data) {
            let res = data.json()
            self.scmTools = res.data;
        }, function (err) {
            console.log(err);
        }, {});
    }
    connnectAws() {
        this.storeService.setStore('awsConnect', {
            showForm: true
        })
        this.router.navigate(['cloud-management'])
    }
    getUserTools() {
        let self = this;
        let url = 'v1/SCMAccounts/get';
        //To check user connected with gitHub
        document.getElementById('loader').style.display = 'block';
        self.httpService.fetchData('get', url, function (data) {
            document.getElementById('loader').style.display = 'none';

            data = data.json();

            let thirdParty = data.data;
            if (thirdParty.length > 0) {
                if (thirdParty[0].type === "github") {
                    self.gitHub = true;
                    return true;
                }
            }
            else {
                self.gitHub = false;
            }

        }, function (err) {
            console.log(err);
        }, {});
    }
    selectPro() {
        var self = this;
        scmConnect(self)
        //self.getUserTools();
        // self.getAllSCM();
    }
    connectDfpClick() {
        var self = this;
        self.connectDfp = true;
        self.doMore = true;
    }



    ngOnInit() {
        var self = this;
        scmConnect(self);
        // self.getUserTools();
        // self.getAllSCM();
        self.parentCol = 4;
        self.codeCol = 2;
        self.cloudCol = 2;
        self.cloudSpan = 2;
        this.noOfDaysInMonthsArray = [31,28,31,31,30,31,31,30,31,30,31];
        this.monthNameArray = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        this.getAwsInstance();
        this.listDfpLinkRepos();
        this.getCloudCosts();
    }
    //calling on change event on linked repos
    onChangeLinkedRepos(value: any){
        this.getGithubcommits('github',value);
    }
    //calling list of repos
    listDfpLinkRepos(hostName = 'github'){
        let self = this;
        let pId = localStorage.getItem('pId');
        let url = 'v1/project/getProjectRepos/' + pId;
        //To check user connected with gitHub
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            self.dfpLinkRepos = data.data;
            if(self.dfpLinkRepos.length > 0){
                self.dfpLinkRepos.sort(self.compare);
                self.selectedRepo = self.dfpLinkRepos[0]['name'];
                self.getGithubcommits('github', self.dfpLinkRepos[0]['name']);
            }
        }, function (err) {
            // self.manageLoader = false;
            console.log("Error Getting List of CodeStacks", err);
            // self.toastr.error('Error Getting List of CodeStack', null, { animate: 'fade', toastLife: 3000 })
        }, {});
    }
    compare(a,b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }
    //---dashboard apis-----
    //----aws instae graph
    getAwsInstance() {
        var self = this;
        self.showLoadChart2 = true;
        this.httpService.fetchData('get', 'v1/aws/getAWSInstance', function (data) {
            var data = data.json();
            if (data) {
                let stoppedAmount: number = 0;
                let runningAmount: number = 0;
                let reservationsData = data.data["Reservations"];
                let reservationLength = reservationsData.length;
                for (let i = 0; i < reservationLength; i++) {
                    let instanceLength = reservationsData[i]['Instances'].length;
                    let instance = reservationsData[i]['Instances'];
                    for (let j = 0; j < instanceLength; j++) {
                        if (instance[j]['State']['Name'] == 'stopped') {
                            stoppedAmount++;
                        } else if (instance[j]['State']['Name'] == 'running') {
                            runningAmount++;
                        }
                    }
                }
                self.totalInstancesCountArray[0] = stoppedAmount;
                self.totalInstancesCountArray[1] = runningAmount;
                self.totalInstancesCount = stoppedAmount + runningAmount;
                self.donutChartOptions = {
                    chartType: 'PieChart',
                    dataTable: [
                        ['Task', 'Hours per Day'],
                        ['Running', self.totalInstancesCountArray[1]],
                        ['Stopped', self.totalInstancesCountArray[0]]

                    ],


                    options: {
                        'focusTarget': 'category',
                        'pieHole': 0.7,
                        // 'pieSliceBorderColor' : '#dd4b39',
                        'pieSliceTextStyle': {
                            'color': 'black',
                            'fontSize': 14
                        },
                        'legend': {
                            'position': 'bottom',
                            // 'position' : 'labeled',
                            // 'alignment' : 'end',
                            //  'marginTop' : "10px",
                            'textStyle': {
                                'fontName': 'PT Sans',
                                'fontSize': 14
                            }
                        },
                        // 'axisTitlesPosition': 'none',
                        'annotations': {
                            'alwaysOutside': true,
                            'textStyle': {
                                'fontSize': 20,
                                'color': 'black',
                                'fontName': 'PT Sans',
                                //'border':
                            }
                        },
                        'tooltip': { 'isHtml': true },
                        'title': '',
                        'bar': {
                            'groupWidth': '80%'
                        },
                        'backgroundColor': {
                            'fill': 'none',
                            'stroke': 'black'
                        },
                        'chartArea': {
                            'width': '80%',
                            'height': '85%',
                            //'left': '20'
                        },
                        'slices': {
                            0: { 'color': '#dd4b39' },
                            1: { 'borderRadius': '25px', 'color': '#f1bb39' }
                        },
                        'colors': ['#dd4b39'],
                        'enableInteractivity': true,

                        'width': 450,
                        'height': 260,

                    },
                }
                self.showLoadChart2 = false;
                return self.totalInstancesCountArray;
            }
        }, function (err) {
            console.log(err);
            self.showLoadChart2 = false;
        });
    }
    //---------git graphs
    formatDate(date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var locale = "en-us";
        var yyyy = date.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        date = mm + '/' + dd + '/' + yyyy;
        date = new Date(date);
        return date.toLocaleString(locale, { month: "short", day: "numeric" });
    }
    Last6Days() {
        var result = [];
        var locale = "en-us";
        for (var i = 5; i >= 0; i--) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            result.push(this.formatDate(d));
        }
        return (result);
    }
    getGithubcommits(hostName='',repoName='') {
        var self = this;
        self.showLoadChart1 = true;
        this.httpService.fetchData('get', 'v1/'+hostName+'/'+repoName+'/commitPerDay', function (data) {
            var curdate = new Date();
            var data = data.json().data;
            if (data.length > 0) {
                self.gitHubCommitsArray = data;
                var lastNodeDateNumber = new Date(data[51].week * 1000).getDate();
                var currentDateNumber = new Date().getDate();
                var concatinateArray = data[data.length - 2].days.concat(data[data.length - 1].days);
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var firstDate = new Date(data[51].week * 1000);
                var secondDate = new Date();
                var diffDays = Math.ceil(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                var concatinateArraySplice = new Array;
                for (var i = 0; i < diffDays; i++) {
                    concatinateArraySplice[i] = data[data.length - 1].days[i];
                }
                var lastArr = new Array;
                var lastIndex = 7 - (diffDays - 1);
                var prevArray = new Array;
                var k = 0;
                for (var j = diffDays; j < 7 - 1; j++) {
                    prevArray.push(data[data.length - 2].days[j]);
                }
                var weekArray = prevArray.concat(concatinateArraySplice);
                var mainArray = new Array;
                var tempArray = new Array;
                var Last6Day = self.Last6Days();
                var Last6DayLen = Last6Day.length;
                //var day = curdate.toLocaleString(locale, { month: "short", day: "numeric" });
                for (var l = 0; l < Last6DayLen; l++) {
                    tempArray['day'] = Last6Day[l];
                    tempArray['commits'] = weekArray[l];
                    mainArray.push(tempArray);
                    tempArray = new Array;
                }
                var totalCommits = 0;
                var mainArrayLen = mainArray.length;
                for(var m=0;m < mainArrayLen; m++){
                    totalCommits += mainArray[m]['commits'];
                }
                self.avgCommitsCount = Math.round(totalCommits/mainArrayLen);
                self.costChartOptions = {
                    chartType: 'ColumnChart',
                    dataTable: [
                        ['Month', 'number of commits'],
                        [mainArray[0]['day'], mainArray[0]['commits']],
                        [mainArray[1]['day'], mainArray[1]['commits']],
                        [mainArray[2]['day'], mainArray[2]['commits']],
                        [mainArray[3]['day'], mainArray[3]['commits']],
                        [mainArray[4]['day'], mainArray[4]['commits']],
                        [mainArray[5]['day'], mainArray[5]['commits']]
                    ],
                    options: {
                        'focusTarget': 'category',
                        'legend': 'none',
                        'axisTitlesPosition': 'none',
                        'annotations': {
                            'alwaysOutside': true,
                            'textStyle': {
                                'fontSize': 16,
                                'color': 'black',
                                'font-weight': 400,
                                'font-family': 'PT Sans'
                            }
                        },
                        'tooltip': { 'isHtml': true },
                        'title': '',
                        'bar': {
                            'groupWidth': '80%'
                        },
                        'backgroundColor': {
                            'fill': 'none',
                            'stroke': 'black'
                        },
                        'chartArea': {
                            'width': '70%',
                            'height': '70%',
                            'right': '20%',
                            'top': 20
                            // 'margin-bottom': '2%'
                        },
                        'colors': ['#dd4b39'],
                        'enableInteractivity': true,
                        'hAxis': {
                            'gridlines': {
                                'color': '#e4e4e4',
                                'count': 5
                            },
                            // 'textPosition': 'none',
                            'titleTextStyle': {
                                'color': 'black',
                                'fontSize': 13,
                                'bold': true
                            }
                        },
                        'vAxis': {
                            'gridlines': {
                                color: 'transparent'
                            },
                             //'format': 'number',
                            // 'textPosition': 'none',
                            'ticks': [0, 10, 20, 30, 40, 50, 60,70, 80],
                            'maxValue': 80
                        },

                        'width': 450,
                        'height': 300,
                        'axes': {
                            'x': {
                                0: { 'side': 'top', 'label': 'my x axis' }
                            },
                            'y': {
                                1: { 'side': 'left', 'label': 'my y axis' }
                            }
                        }
                    },
                };
                
            }
            self.showLoadChart1 = false;
        },
        function (err) {
            console.log(err);
            self.showLoadChart1 = false;
        });
    }
    getPerWeeksCommit(){
        this.showLoadChart1 = true;
        var data = this.gitHubCommitsArray;
        var mainArray = new Array;
        mainArray = [{'day':'', 'commits':''},{'day':'', 'commits':''},{'day':'', 'commits':''},{'day':'', 'commits':''},{'day':'', 'commits':''},{'day':'', 'commits':''}];
        mainArray[0]['day'] = 'Week6';
        mainArray[1]['day'] = 'Week5';
        mainArray[2]['day'] = 'Week4';
        mainArray[3]['day'] = 'Week3';
        mainArray[4]['day'] = 'Week2';
        mainArray[5]['day'] = 'Week1';
        //
        mainArray[5]['commits'] = data[data.length -1].total;
        mainArray[4]['commits'] = data[data.length -2].total;
        mainArray[3]['commits'] = data[data.length -3].total;
        mainArray[2]['commits'] = data[data.length -4].total;
        mainArray[1]['commits'] = data[data.length -5].total;
        mainArray[0]['commits'] = data[data.length -6].total;
        var totalCommits = 0;
        for(let i=1;i<7;i++){
            totalCommits += data[data.length -i].total;
        } 
        var mainArrayLen = mainArray.length;
        this.avgCommitsCount = Math.round(totalCommits/mainArrayLen);
        this.costChartOptions = {
            chartType: 'ColumnChart',
            dataTable: [
                ['Month', 'number of commits'],
                [mainArray[0]['day'], mainArray[0]['commits']],
                [mainArray[1]['day'], mainArray[1]['commits']],
                [mainArray[2]['day'], mainArray[2]['commits']],
                [mainArray[3]['day'], mainArray[3]['commits']],
                [mainArray[4]['day'], mainArray[4]['commits']],
                [mainArray[5]['day'], mainArray[5]['commits']]
            ],
            options: {
                'focusTarget': 'category',
                'legend': 'none',
                'axisTitlesPosition': 'none',
                'annotations': {
                    'alwaysOutside': true,
                    'textStyle': {
                        'fontSize': 16,
                        'color': 'black',
                        'font-weight': 400,
                        'font-family': 'PT Sans'
                    }
                },
                'tooltip': { 'isHtml': true },
                'title': '',
                'bar': {
                    'groupWidth': '80%'
                },
                'backgroundColor': {
                    'fill': 'none',
                    'stroke': 'black'
                },
                'chartArea': {
                    'width': '70%',
                    'height': '70%',
                    'right': '20%',
                    'top': 20
                    // 'margin-bottom': '2%'
                },
                'colors': ['#dd4b39'],
                'enableInteractivity': true,
                'hAxis': {
                    'gridlines': {
                        'color': '#e4e4e4',
                        'count': 5
                    },
                    // 'textPosition': 'none',
                    'titleTextStyle': {
                        'color': 'black',
                        'fontSize': 13,
                        'bold': true
                    }
                },
                'vAxis': {
                    'gridlines': {
                        color: 'transparent'
                    },
                        //'format': 'number',
                    // 'textPosition': 'none',
                    'ticks': [0, 10, 20, 30, 40, 50, 60, 70, 80],
                    'maxValue': 10
                },

                'width': 450,
                'height': 300,
                'axes': {
                    'x': {
                        0: { 'side': 'top', 'label': 'my x axis' }
                    },
                    'y': {
                        1: { 'side': 'left', 'label': 'my y axis' }
                    }
                }
            },
        };
        this.showLoadChart1 = false;
    }
    flifToggle(){
        console.log(this.selectedRepo);
        if(this.perDayToggle){
            this.onChangeLinkedRepos(this.selectedRepo);
        }else{
            this.getPerWeeksCommit();
        }
    }
    compareDates(a,b) {
        let c: any = new Date(a.Timestamp);
        var d: any = new Date(b.Timestamp);
        return c-d;
    }
    costDatecompare(a,b) {
        if (a.Timestamp < b.Timestamp)
            return -1;
        if (a.Timestamp > b.Timestamp)
            return 1;
        return 0;
    }
    getCloudCosts(){
        var self = this;
        self.showLoadChart3 = true;
        //this.cloudCostResponse.data.Datapoints.sort(this.compareDates);
        var currentDateNumber = new Date().toISOString();
        var currDate = new Date();
        currDate.setMonth(currDate.getMonth() - 6);
        var sixMonthPriorDate = currDate.toISOString();
        let payload = {
            "endTime": currentDateNumber, 
            "period": 2678400,
            "startTime": sixMonthPriorDate,
            "dimensions":[
                {
                    "Name": "ServiceName",
                    "Value": "AmazonEC2"
                },
                {
                    "Name": "Currency",
                    "Value": "USD"
                }
            ],
            "statistics": [ "Sum" ]
        };
        this.httpService.fetchData('post', 'v1/aws/getBillingByServiceNames', function (data) {
            var curdate = new Date();
            var data = data.json().data;
            if (data && ('Datapoints' in data)) {
                self.cloudCostResponse = data.Datapoints;
                self.cloudCostResponse.sort(self.costDatecompare);
                var cloudCostResponseLen = self.cloudCostResponse.length;
                for(var i=0;i<cloudCostResponseLen;i++){
                    self.cloudCostResponse[i].Sum = parseInt(parseFloat(self.cloudCostResponse[i].Sum).toFixed(2));
                    var dt = new Date(self.cloudCostResponse[i].Timestamp);
                    self.cloudCostResponse[i].Month = self.monthNameArray[dt.getMonth()];
                }
                self.cpuUtilChartOptions = {
                        chartType: 'ColumnChart',
                        dataTable: [
                            ['Month', 'Cost in USD'],
                            [self.cloudCostResponse[0].Month, self.cloudCostResponse[0].Sum],
                            [self.cloudCostResponse[1].Month, self.cloudCostResponse[1].Sum],
                            [self.cloudCostResponse[2].Month, self.cloudCostResponse[2].Sum],
                            [self.cloudCostResponse[3].Month, self.cloudCostResponse[3].Sum],
                            [self.cloudCostResponse[4].Month, self.cloudCostResponse[4].Sum],
                            [self.cloudCostResponse[5].Month, self.cloudCostResponse[5].Sum]
                        ],
                        options: {
                            'focusTarget': 'category',
                            'legend': 'none',
                            'axisTitlesPosition': 'none',
                            'annotations': {
                                'alwaysOutside': true,
                                'textStyle': {
                                    'fontSize': 16,
                                    'color': 'black',
                                    'font-weight': 400,
                                    'font-family': 'PT Sans'
                                }
                            },
                            'tooltip': { 'isHtml': true },
                            'title': '',
                            'bar': {
                                'groupWidth': '80%'
                            },
                            'backgroundColor': {
                                'fill': 'none',
                                'stroke': 'black'
                            },
                            'chartArea': {
                                'width': '70%',
                                'height': '70%',
                                'right': '20%',
                                'top': 20
                                // 'margin-bottom': '2%'
                            },
                            'colors': ['#dd4b39'],
                            'enableInteractivity': true,
                            'hAxis': {
                                'gridlines': {
                                    'color': '#e4e4e4',
                                    'count': 5
                                },
                                // 'textPosition': 'none',
                                'titleTextStyle': {
                                    'color': 'black',
                                    'fontSize': 13,
                                    'bold': true
                                }
                            },
                            'vAxis': {
                                'gridlines': {
                                    color: 'transparent'
                                },
                                //'format': 'number',
                                // 'textPosition': 'none',
                                'ticks': [0, 100, 1000, 2000, 3000, 4000, 5000, 6000],
                                'maxValue': 6000,
                                'minValue': 0
                            },

                            'width': 450,
                            'height': 300,
                            'axes': {
                                'x': {
                                    0: { 'side': 'top', 'label': 'my x axis' }
                                },
                                'y': {
                                    1: { 'side': 'left', 'label': 'my y axis' }
                                }
                            }
                        },
                    };
                
            }
            self.showLoadChart3 = false;
        },
        function (err) {
            console.log(err);
            self.showLoadChart3 = false;
        }, payload);
    }
}

