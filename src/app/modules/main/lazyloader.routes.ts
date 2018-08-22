import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './components';
import {UserListModule} from './../user-list/user-list.module';
import {TypeAdvisoryModule} from './../type-advisory/type-advisory.module';
import {SpecialistModule} from '../specialist/specialist.module';
import {ReportsModule} from '../reports/reports.module';
// import { DashboardCrmComponent } from '../dashboard-crm/dashboard-crm.component';

export const appRoutes: Routes = [{
    path: '', component: MainComponent, children: [
        {path: '', loadChildren: userList},
        {path: 'users', loadChildren: userList},
        {path: 'type-advisories', loadChildren: typeAdvisoryList},
        {path: 'specialist', loadChildren: specialist},
        {path: 'reports', loadChildren: reports},
        // { path: 'tables', loadChildren: '../tables/tables.module#TablesModule' },
        // { path: 'maps', loadChildren: '../maps/maps.module#MapsModule' },
        // { path: 'charts', loadChildren: '../charts/charts.module#ChartsModule' },
        // // { path: 'chats', loadChildren: '../chats/chat.module#ChatsModule' }, // fix this
        // //{ path: 'mail', loadChildren: '../mail/mail.module#MailModule' }, // fix this
        // { path: 'pages', loadChildren: '../pages/pages.module#PagesModule' },
        // { path: 'forms', loadChildren: '../forms/forms.module#FormModule' }, //fix this
        // { path: 'guarded-routes', loadChildren: '../guarded-routes/guarded-routes.module#GuardedRoutesModule' },
        // { path: 'editor', loadChildren: '../editor/editor.module#EditorModule' },
        // { path: 'scrumboard', loadChildren: '../scrumboard/scrumboard.module#ScrumboardModule' },
    ]
}];
export function userList() {
    return UserListModule;
}
export function typeAdvisoryList() {
    return TypeAdvisoryModule;
}
export function specialist() {
    return SpecialistModule;
}
export function reports() {
    return ReportsModule;
}
