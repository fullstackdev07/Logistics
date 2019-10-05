import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractorsComponent } from './contractors.component';


import { ListComponent } from './list/list.component';

import { AddeditComponent } from './addedit/addedit.component';


const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  {
    path : 'addedit',
    component : AddeditComponent
  },
  {
    path: 'addedit/:contractorId',
    component : AddeditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractorsRoutingModule { }
