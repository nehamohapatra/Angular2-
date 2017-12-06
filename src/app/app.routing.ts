import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { EmailVerificationComponent } from './auth/email-onboarding/email_onboarding.component';
import { SetupPasswordComponent } from './auth/setup-password/setup_password.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { ProjectLandingComponent } from './project/project-landing/project-landing.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { HomeComponent } from './home/home.component';
import { ResetPwdComponent } from './auth/reset-password/reset-password.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { CodeComponent } from './code/repository/repository.component';
import { LinkRepositoryComponent } from './code/link-repository/link-repository.component';
import { BundlesAndStackComponent } from './code/bundles-stacks/bundles-stacks.component';
import { CreateRepositoryComponent } from './code/create-repository/create-repository.component';
import { CloudManageComponent } from './cloud/cloud-manage.component';
import { CloudServiceComponent } from './cloud/services/cloud-services.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ActivitiesComponent } from './activities/activities.component';
import { AppSideComponent } from './appSideMenu/apps-account.component';
import { AwsOnboardComponent } from './cloud/onBoardCloud/aws-onboard.component';
import { AzureAccountComponent } from './cloud/cloud-account/azure-account.component';
import { ManageProfileComponent } from './groups/manage-profile/manage-profile.component';
import { RepToolchain } from './code/repository/repToolchain.component';
import { CloudAccountComponent } from './cloud/cloud-account/cloud-account.component';

import * as _ from 'lodash';
const routes: Routes = [
  //{ path: '', component: HomeComponent },
  // { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'email-onboarding', component: EmailVerificationComponent },
  { path: 'email-onboarding/', component: EmailVerificationComponent },
  { path: 'setup-password', component: SetupPasswordComponent },
  { path: 'setup-password/', component: SetupPasswordComponent },
  { path: 'create-project', component: CreateProjectComponent },
  { path: 'project-landing', component: ProjectLandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/', component: LoginComponent },
  { path: 'reset-password', component: ResetPwdComponent },
  { path: 'reset-password/', component: ResetPwdComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'aws-onboard', component: AwsOnboardComponent },
  { path: 'group', component: ManageProfileComponent },

  {
    path: 'code', component: CodeComponent,
    children: [
      { path: '', component: BundlesAndStackComponent },
      { path: 'link-repository', component: LinkRepositoryComponent }
    ]
  },
  {
    path: 'code/', component: CodeComponent,
    children: [
      { path: '', component: BundlesAndStackComponent },
      { path: 'link-repository', component: LinkRepositoryComponent }
    ]
  },
  { path: 'cloud-management', component: CloudManageComponent },
  { path: 'apps-sidemenu', component: AppSideComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'activities', component: ActivitiesComponent },

  { path: 'repository', component: RepToolchain },
  { path: 'cloud-account', component: CloudAccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class DfpRouting {
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      //Check
      if (val.constructor.name == 'NavigationStart') {
        const token = localStorage.getItem('token')
        // const allowedPages = ['/login', '/setup-password', '/email-onboarding', '/', '/edit-profile', '/code', '/code/link-repository', '/code/create-repository', '/registration', '/manage-rep', '/cloud-management']
        const allowedPages = ['/login', '/setup-password', '/email-onboarding', '/email-onboarding/', '/','/registration','/reset-password', '/reset-password/', '/setup-password/','/manage-profile/']
        let nextRoute = val.url
        nextRoute = nextRoute.indexOf('?') == -1 ? nextRoute : nextRoute.substr(0, nextRoute.indexOf('?'));
        if (allowedPages.indexOf(nextRoute) == -1) {
          if (!token) {
            this.router.navigate(['/login'])
            alert("Your session has expired.Please login");
          }
        }
      }

    })

  }
}
