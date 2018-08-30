import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BankingListComponent} from './components';

const route: Routes = [
    {path: '', component: BankingListComponent, data: {animation: 'responsive'}}
];

@NgModule({
    imports: [
        RouterModule.forChild(route)
    ],
    exports: [
        RouterModule
    ]
})
export class BankingRouter {
}
