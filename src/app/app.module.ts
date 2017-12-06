import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { DfpRouting } from './app.routing';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { EmailVerificationComponent } from './auth/email-onboarding/email_onboarding.component';
import { SetupPasswordComponent } from './auth/setup-password/setup_password.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ResetPwdComponent } from './auth/reset-password/reset-password.component';
import { HeaderMenuComponent } from './menu/header-menu/header-menu.component';
import { SideMenuComponent } from './menu/side-menu/side-menu.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { ProjectLandingComponent } from './project/project-landing/project-landing.component';
import { CodeComponent } from './code/repository/repository.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { LinkRepositoryComponent } from './code/link-repository/link-repository.component';
import { BundlesAndStackComponent } from './code/bundles-stacks/bundles-stacks.component';
import { CreateRepositoryComponent } from './code/create-repository/create-repository.component';
import { BuildTestComponent } from './code/build-test/build-test.component';
import { CloudManageComponent } from './cloud/cloud-manage.component';
import { CloudServiceComponent } from './cloud/services/cloud-services.component';
import { CloudAzureComponent } from './cloud/services/cloud-azure.component';
import { CloudAccountComponent } from './cloud/cloud-account/cloud-account.component';
import { CloudManageDetailComponent } from './cloud/manage/cloud-manage-detail.component';
import { AzureAccountComponent } from './cloud/cloud-account/azure-account.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ActivitiesComponent } from './activities/activities.component';
import { InputFilter } from './services/query.service';
import { SortPipe } from './services/sort.pipe';
import { AceEditorComponent, AceEditorDirective } from 'ng2-ace-editor';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { AppSideComponent } from './appSideMenu/apps-account.component';
import { AppItemCompoenent } from './appSideMenu/app-item.component';
import { AwsOnboardComponent } from './cloud/onBoardCloud/aws-onboard.component';
import { AppAccountDialogComponent } from './appSideMenu/app-accountDialog.component';
import { RepToolchain } from './code/repository/repToolchain.component';
import { ManageProfileComponent } from './groups/manage-profile/manage-profile.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    EmailVerificationComponent,
    SetupPasswordComponent,
    CreateProjectComponent,
    RegistrationComponent,
    ResetPwdComponent,
    HeaderMenuComponent,
    SideMenuComponent,
    EditProfileComponent,
    CodeComponent,
    ProjectLandingComponent,
    BundlesAndStackComponent,
    LinkRepositoryComponent,
    CreateRepositoryComponent,
    BuildTestComponent,
    InputFilter,
    CloudManageComponent,
    CloudServiceComponent,
    CloudAzureComponent,
    CloudAccountComponent,
    CloudManageDetailComponent,
    UserManagementComponent,
    AzureAccountComponent,
    ActivitiesComponent,
    SortPipe,
    AceEditorComponent,
    AceEditorDirective,
    AppSideComponent,
    AppItemCompoenent,
    AppAccountDialogComponent,
    RepToolchain,
    AwsOnboardComponent,
    ManageProfileComponent


  ],
  entryComponents:[AppAccountDialogComponent],
  imports: [
    Ng2GoogleChartsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ToastModule,
    MaterialModule.forRoot(),
    DfpRouting,
    ReactiveFormsModule,
    FlexLayoutModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
