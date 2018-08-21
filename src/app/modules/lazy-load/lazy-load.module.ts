import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginModule} from '../login/login.module';
import {MainModule} from '../main/main.module';


const routes: Routes = [
    {path: 'admin', loadChildren: () => MainModule},
    {path: '', loadChildren: () => MainModule},
    // {path: 'register', loadChildren: '../register/register.module#RegisterModule'},
    {path: 'login', loadChildren: () => LoginModule},
    // {path: 'editor', loadChildren: '../editor/editor.module#EditorModule'},

    // {path: '**', redirectTo: 'auth/dashboard'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class LazyLoadModule {
}
