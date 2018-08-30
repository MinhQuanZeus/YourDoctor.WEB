import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TypeAdvisoryListComponent} from './components';

const route: Routes = [
    {path: '', component: TypeAdvisoryListComponent, data: {animation: 'responsive'}}
];

@NgModule({
    imports: [
        RouterModule.forChild(route)
    ],
    exports: [
        RouterModule
    ]
})
export class TypeAdvisoryRouter {
}
