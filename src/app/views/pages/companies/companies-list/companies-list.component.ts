import {Component, OnDestroy, OnInit, ViewChild , ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
// import { LayoutUtilsService } from '../../../core/_base/crud';
// import { CustomerModel} from '../../../core/e-commerce';
import { Router } from '@angular/router';

import { CompaniesService } from './../companies.service';

import { TranslationService } from '../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';

class Tdata {

}

@Component({
  selector: 'kt-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent implements OnInit {

	dtOptions: DataTables.Settings = {};

	dataSourcee : any = [];

    // dataSourcee = [];
	// displayedColumns = ['name1', 'name2', 'street', 'email', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	// selection = new SelectionModel<CustomerModel>(true, []);
	responsibleUsers = [];

	@ViewChild(DataTableDirective)
    datatableElement: DataTableDirective;

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private companiesService: CompaniesService,
		// private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private cd: ChangeDetectorRef,
		private transServ : TranslationService
	) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	 }

	ngOnInit() {
		this.dataTableCall();
	}

	filterVal : any;

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

	editComapny(id) {
		this.router.navigate([`/companies/addedit/${id}`]);
	}

	ngOnDestroy() {
	}

	public getClientsList() {	
		
		this.companiesService .getCompaniessList({}).subscribe((result) => {					
				this.dataSourcee = result.data;
				this.cd.markForCheck();				
			},
			err => {

			});
	}
	addCompany() {
		this.router.navigate(['companies/addedit']);
		// this.dialog.open(DialogDataExampleDialog);
	}

	response : any ;
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
			// dataTablesParameters.search.closed_files=this.dateRange;
			// dataTablesParameters.search.date_fin=this.dateRange_fin;
			// dataTablesParameters.search.date_cls = this.dateRange_cls;
  
			this.companiesService .getCompaniessList(dataTablesParameters).subscribe(resp => {
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

	deleteCompany(id) {
		this.companiesService.deleteCompany({companyId : id})
			.subscribe((data) => {
					this.getClientsList();
				},
				err => {

				});
	}

}
