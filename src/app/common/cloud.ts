var getAwsProjectDetail = function (self, bool) {
    let url = "v1/aws/get";
    var cloudValue = self.storeService.getStore('cloudData')
    if (cloudValue && !bool) {
        if (cloudValue.cloud.data) {
            self.cloudDetail = cloudValue.cloud.data.name;
            self.cloudDetailRegion = cloudValue.cloud.data.region;
            self.addDetail = true;
            self.activeAws = true;
            self.disableTab = false;
             self.cloudIndex = 0;
              self.showLoad = false;
        }
        else {
             self.cloudIndex = 2;
            self.addDetail = false;
             self.disableTab = true;
            if (self.storeService.getStore('awsConnect')) {

                if (self.storeService.getStore('awsConnect').showForm) {
                    self.activeAws = true;
                    self.storeService.setStore('awsConnect', { showForm: false })
                }
                else {
                    self.activeAws = false;
                }
            }
             self.showLoad = false;
        }

    }
    else {
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            if (data.data) {
                 self.cloudIndex = 0;
                var cloudData = data;
                self.storeService.setStore('cloudData', { cloud: cloudData })
                self.cloudDetail = data.data.name;
                self.cloudDetailRegion = data.data.region;
                 self.disableTab = false;
                self.addDetail = true;
                self.activeAws = true;
                self.showLoad = false;
            }
            else {
                 self.cloudIndex = 2;
                self.addDetail = false;
                 self.disableTab = true;
                if (self.storeService.getStore('awsConnect')) {

                    if (self.storeService.getStore('awsConnect').showForm) {

                        self.activeAws = true;
                        self.storeService.setStore('awsConnect', { showForm: false })
                    }
                    else {
                        self.activeAws = false;
                    }
                }
                 self.showLoad = false;
            }

        }, function (err) {
            console.log(err);
        }, {});
    }

}


export function getAwsRegions(self, bool = false) {
    let url = "v1/aws/getRegions";
    self.cloudLoader = true;
    var cloudRegion = self.storeService.getStore('cloudRegion')
    console.log("Boolean value", bool)
    if (cloudRegion && !bool) {
        if (cloudRegion.region.data) {
            self.awsCloudRegions = cloudRegion.region.data[0].region;
            self.awsRegions = cloudRegion.region.data;
            getAwsProjectDetail(self, bool);
        }
        self.cloudLoader = false;

    } else {
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            if (data.data) {
                self.awsCloudRegions = data.data[0].region;
                self.storeService.setStore('cloudRegion', { region: data })
                self.awsRegions = data.data;
                getAwsProjectDetail(self, bool);
            }
            self.cloudLoader = false;

        }, function (err) {
            console.log(err);
        }, {});
    }


}



export function getAwsStaticRegions(self, bool = false) {
    let url = "v1/aws/getRegions";
    var cloudRegion = self.storeService.getStore('cloudRegion')
    console.log("Boolean value", bool)
    if (cloudRegion && !bool) {
        if (cloudRegion.region.data) {
            self.awsCloudRegions = cloudRegion.region.data[0].region;
            self.awsRegions = cloudRegion.region.data;
            getAwsProjectDetail(self, bool);
        }

    } else {
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            if (data.data) {
                self.awsCloudRegions = data.data[0].region;
                self.storeService.setStore('cloudRegion', { region: data })
                self.awsRegions = data.data;
                return self.awsRegions;
                // getAwsProjectDetail(self, bool);

            }

        }, function (err) {
            console.log(err);
        }, {});
    }


}
