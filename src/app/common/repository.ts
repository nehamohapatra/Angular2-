export function scmConnect(self, overriteStore = false, Bool = true) {

    const scmStore = self.storeService.getStore('scmAccount')
    const pid = localStorage.getItem('pId');

    if (scmStore && !overriteStore) {
        self.scmArray = scmStore.scmAccounts;
        if (scmStore.pId == pid && scmStore.scmAccounts.length > 0) {
            if (scmStore.scmAccounts[0].type === "github") {
                self.ownerDetails = scmStore.scmAccounts[0]
                self.gitHub = true;
                self.selectedId = scmStore.scmAccounts[0]._id
                if (self.githubSuccessMsg != undefined) {
                    if (Bool) {
                        self.toastr.success('Github successfully linked', null, { animate: 'fade', toastLife: 3000 })
                    }
                    if (self.thirdElem != undefined) {
                        self.thirdElem.click();
                        console.log('Working!')
                    }
                }
                self.showLoad = false;
                self.linkRepos = false;
                return true;
            }

        }
        else {
            if (self.thirdElem != undefined) {
                self.thirdElem.click()
            }
            self.ftUser = true;
            self.bsTab = true;
             self.showLoad = false;
             self.linkRepos = true;

        }
    }
    else {
        self.httpService.fetchData('get', 'v1/SCMAccounts/get', function (data) {
            data = data.json();
            let thirdParty = data.data;
            self.scmArray = data.data;
            //set thirdParty scm to store
            self.storeService.setStore('scmAccount', {
                scmAccounts: thirdParty,
                pId: pid
            })

            if (thirdParty.length > 0) {
                if (thirdParty[0].type === "github") {
                    self.ownerDetails = thirdParty[0];
                    self.gitHub = true;
                    self.selectedId = thirdParty[0]._id;
                    // if (Bool) {
                    //     if (self.githubSuccessMsg != undefined) {
                    //         console.log("Inside create repo")
                    //         self.toastr.success('Github successfully linked', null, { animate: 'fade', toastLife: 3000 })
                    //     }
                    // }
                }
                if (self.githubSuccessMsg != undefined) {
                    if (Bool) {
                        self.toastr.success('Github successfully linked', null, { animate: 'fade', toastLife: 3000 })
                    } if (self.thirdElem != undefined) {
                        self.thirdElem.click();
                        console.log('Working!')
                    }
                }
                self.ftUser = false;
                self.bsTab = false;
                 self.showLoad = false;
                 self.linkRepos = false;
                return true;
            }
            else {
                if (self.thirdElem != undefined) {
                    self.thirdElem.click()
                }

                self.gitHub = false;
                self.ownerDetails = {};
                self.selectedId = '';
                self.ftUser = true;
                self.bsTab = true;
                 self.showLoad = false;
                 self.linkRepos = true;
            }

        }, function (err) {
            console.log(err);
        }, {});
    }
}