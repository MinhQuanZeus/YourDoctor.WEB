import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserListComponent} from './components';

const route: Routes = [
    { path: '', component: UserListComponent , data: { animation: 'responsive' }}
];

@NgModule({
    imports: [
        RouterModule.forChild(route)
    ],
    exports: [
        RouterModule
    ]
})
export class UserListRouter {}
