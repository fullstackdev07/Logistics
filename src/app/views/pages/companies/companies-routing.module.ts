import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { AddeditComponent } from './addedit/addedit.component';

const routes: Routes = [
  {
    path : '',
    component : CompaniesListComponent
  },
  {
    path : 'addedit',
    component : AddeditComponent
  }
  ,
  {
    path : 'addedit/:companyId',
    component : AddeditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
