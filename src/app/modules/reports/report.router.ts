import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ReportListComponent} from './components';

const route: Routes = [
    { path: '', component: ReportListComponent , data: { animation: 'responsive' }}
];

@NgModule({
    imports: [
        RouterModule.forChild(route)
    ],
    exports: [
        RouterModule
    ]
})
export class ReportRouter {
}
