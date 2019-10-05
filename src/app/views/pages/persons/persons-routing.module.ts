import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { AddeditComponent } from './addedit/addedit.component';

const routes: Routes = [
  {
    path : '',
    component : ListComponent
  },
  {
    path : 'addedit',
    component : AddeditComponent
  }
  ,
  {
    path : 'addedit/:personId',
    component : AddeditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonsRoutingModule { }
