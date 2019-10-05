// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
// Auth
import { AuthGuard } from '../../../core/auth';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: 'app/views/pages/dashboard/dashboard.module#DashboardModule'
			},
			{
				path: 'clients',
				loadChildren: 'app/views/pages/clients/clients.module#ClientsModule'
			},

			{
				path: 'invoice',
				loadChildren: 'app/views/pages/invoice/invoice.module#InvoiceModule'
			},
			
			{
				path: 'contractors',
				loadChildren: 'app/views/pages/contractors/contractors.module#ContractorsModule'
			},

			{
				path: 'companies',
				loadChildren: 'app/views/pages/companies/companies.module#CompaniesModule'
			},
			{
				path: 'article',
				loadChildren: 'app/views/pages/article/article.module#ArticleModule'
			},
			{
				path: 'persons',
				loadChildren: 'app/views/pages/persons/persons.module#PersonsModule'
			},
			{
				path: 'orders',
				loadChildren: 'app/views/pages/orders/orders.module#OrdersRoutesModule'
			},

			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'clients', pathMatch: 'full'},
			// {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}
