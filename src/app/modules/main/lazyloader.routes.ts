import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './components';
import {UserListModule} from './../user-list/user-list.module';
import {TypeAdvisoryModule} from './../type-advisory/type-advisory.module';
import {SpecialistModule} from '../specialist/specialist.module';
import {ReportsModule} from '../reports/reports.module';
import {BankingModule} from '../banking/banking.module';
// import { DashboardCrmComponent } from '../dashboard-crm/dashboard-crm.component';

export const appRoutes: Routes = [{
    path: '', component: MainComponent, children: [
        {path: '', loadChildren: './../user-list/user-list.module#UserListModule'},
        {path: 'users', loadChildren: './../user-list/user-list.module#UserListModule'},
        {path: 'type-advisories', loadChildren: './../type-advisory/type-advisory.module#TypeAdvisoryModule'},
        {path: 'specialist', loadChildren: '../specialist/specialist.module#SpecialistModule'},
        {path: 'reports', loadChildren: '../reports/reports.module#ReportsModule'},
        {path: 'banking', loadChildren: '../banking/banking.module#BankingModule'},
    ]
}];
// export function userList() {
//     return UserListModule;
// }
// export function typeAdvisoryList() {
//     return TypeAdvisoryModule;
// }
// export function specialist() {
//     return SpecialistModule;
// }
// export function reports() {
//     return ReportsModule;
// }
//
// export function banking() {
//     return BankingModule;
// }
