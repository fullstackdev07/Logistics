import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../core/_base/crud';
import { CustomerModel} from '../../../core/e-commerce';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Inject} from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
	dataSourcee = [];
	displayedColumns = ['name1', 'name2', 'street', 'email', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	selection = new SelectionModel<CustomerModel>(true, []);
	responsibleUsers = [];

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private userService: UserService,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService
	) { }

	ngOnInit() {
		this.getAllClients();
	}

	goToUser(id) {
		this.router.navigate([`/user/${id}/overview`]);
	}

	ngOnDestroy() {
	}

	public getAllClients() {
		this.userService
			.getAllClients()
			.subscribe((data) => {
				this.dataSourcee = data;
					this.router.navigate([`/`]);
			},
			err => {

			});
	}
	openDialog() {
		this.router.navigate(['create-user']);
		// this.dialog.open(DialogDataExampleDialog);
	}

	deleteUser(id) {
		this.userService
			.deleteClient(id)
			.subscribe((data) => {
					this.dataSourcee = this.dataSourcee.filter(data => data._id !== id);
					// this.router.navigate([`/`]);
				},
				err => {

				});
	}

}
