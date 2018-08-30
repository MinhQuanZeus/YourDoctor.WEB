import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
    {path: 'admin', loadChildren: '../main/main.module#MainModule'},
    {path: '', loadChildren: '../main/main.module#MainModule'},
    // {path: 'login', loadChildren: '../register/register.module#RegisterModule'},
    {path: 'login', loadChildren: '../login/login.module#LoginModule'},
    // {path: 'editor', loadChildren: '../editor/editor.module#EditorModule'},

    // {path: '**', redirectTo: 'auth/dashboard'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class LazyLoadModule {
}
