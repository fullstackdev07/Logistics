import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ClientsComponent } from './clients.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { OverviewComponent } from './addedit/overview/overview.component';
import { AddeditComponent } from './addedit/addedit.component';
// import { RoutesListComponent } from './user-details/routes/routes-list/routes-list.component';

const routes: Routes = [
  
    {
      path: '',
      component: ClientsListComponent
    },
    {
      path : 'addedit',
      component : AddeditComponent
    },
    {
      path : 'addedit/:clientId',
      component : AddeditComponent
    }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
