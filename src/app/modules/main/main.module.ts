import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './components';
import {RouterModule} from '@angular/router';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {appRoutes} from './lazyloader.routes';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
import {CoreModule} from '../core/core.module';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(appRoutes),
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        CoreModule,
        MatSidenavModule,
        PerfectScrollbarModule,
    ],
    declarations: [MainComponent],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class MainModule {
}
