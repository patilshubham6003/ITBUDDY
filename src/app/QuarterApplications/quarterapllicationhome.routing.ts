import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuarterApllicationHomeComponent } from './quarter-apllication-home.component';
import { AplicationListComComponent } from './QuarterComponents/aplication-list-com/aplication-list-com.component';
import { DahforquarterapplComponent } from './dahforquarterappl/dahforquarterappl.component';

const routes: Routes = [
    {
        path: '',
        component: QuarterApllicationHomeComponent,
        children: [
            { path: 'employee-quarter-applications', component: AplicationListComComponent },
            { path: 'quarter_applications_dashboard', component: DahforquarterapplComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuarterapllicationhomeRoutingModule { }
