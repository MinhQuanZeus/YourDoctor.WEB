import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SpecialistComponent} from './components';

const route: Routes = [
    {path: '', component: SpecialistComponent, data: {animation: 'responsive'}}
];

@NgModule({
    imports: [
        RouterModule.forChild(route)
    ],
    exports: [
        RouterModule
    ]
})
export class SpecialistRouter {
}
