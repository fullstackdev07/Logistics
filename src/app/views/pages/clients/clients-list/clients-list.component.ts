import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef , ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { Inject} from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerModel} from '../../../../core/e-commerce';
import { ClientsService } from './../clients.service';

import { TranslationService } from '../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'kt-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {

    dataSourcee : any = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	selection = new SelectionModel<CustomerModel>(true, []);
	responsibleUsers = [];

	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective)
  	datatableElement: DataTableDirective;

	filterVal : any ;

	canEdit : any = true;
	canDelete : any = true;

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private clientService : ClientsService,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private clientsServices : ClientsService,
		private cd: ChangeDetectorRef,
		private transServ : TranslationService
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

	 }

	ngOnInit() {
		// this.dataSourcee = [{'name1' : 'test1' , 'name2' : 'test2' , 'street' :'120/12 1st Main' ,'email' : 'test@gmail.com' ,'id' : 1 }]
		this.dataTableCall();
	}

	goToUser(id) {
		this.router.navigate([`/clients/addedit/${id}`]);
	}

	ngOnDestroy() {
	}

	public getClientsList() {	
		
		this.clientsServices.getClientsList({}).subscribe((result) => {					
				this.dataSourcee = result.data;
				this.cd.markForCheck();				
			},
			err => {

			});
	}
	openDialog() {
		this.router.navigate(['clients/addedit']);
		// this.dialog.open(DialogDataExampleDialog);
	}

	openInvoice() {
		this.router.navigate(['invoice']);
	
	}

	deleteClient(clientId : any){

		this.clientsServices.deleteClient({'clientId' : clientId}).subscribe((result) => {					
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
			});	
		},
		err => {

		});
		
		
	}

	response : any;

	public dataTableCall(){
		this.dtOptions = {
		  pagingType: 'full_numbers',
		  pageLength: 10,
		  responsive: true,
		  searching: false,
		  lengthChange: false,
		  serverSide: true,
		  processing: true,
		  order:[],
		  columnDefs: [
			  {
				"targets": 'nosort',
				"orderable": false
			  }
		  ],
		  language: this.transServ.dataTableLang(),
		  ajax: (dataTablesParameters: any, callback) => {
			 
			  dataTablesParameters.search.value=this.filterVal;
	
			  this.clientsServices.getClientsList(dataTablesParameters).subscribe(resp => {
				this.response = resp;
				if(this.response && this.response.data){
				  this.dataSourcee = this.response.data;
					//console.log(this.response.data)
					this.cd.markForCheck();	
					callback({
					  recordsTotal: this.response.recordsTotal,
					  recordsFiltered: this.response.recordsFiltered,
					  data: []
					});
	
					// this.spinner.hide();
				}async: true
	
			  });
		  }
		};
	  }

	  filterData($event){
		this.filterVal = "";
		let value = $event.target.value;
		if(value){
		  this.filterVal = value;
		}
	
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
		  dtInstance.draw();
		});
		  // console.log($event);
		  
	  }

	// deleteUser(id) {
	// 	this.clientService 
	// 		.deleteClient(id)
	// 		.subscribe((data) => {
	// 				this.dataSourcee = this.dataSourcee.filter(data => data._id !== id);
	// 				// this.router.navigate([`/`]);
	// 			},
	// 			err => {

	// 			});
	// }

}
