import {Component, OnDestroy, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
// import { LayoutUtilsService } from '../../../core/_base/crud';
// import { CustomerModel} from '../../../core/e-commerce';
import { Router } from '@angular/router';
import { ContractorsService } from './../contractors.service';;
import { Inject} from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from '../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  dataSourcee : any = [];
	displayedColumns = ['name1', 'name2', 'street', 'email', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	// selection = new SelectionModel<CustomerModel>(true, []);
	responsibleUsers = [];

	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective)
  	datatableElement: DataTableDirective;

	filterVal : any ;

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private contractorsService: ContractorsService,
		// private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private cd: ChangeDetectorRef,
		private transServ : TranslationService
	) { 

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		// this.getContractorsList();
		this.dataTableCall();
	}

	goToUser(id) {
		this.router.navigate([`/contractors/addedit/${id}`]);
	}

	ngOnDestroy() {
	}

	public getContractorsList() {	
		
		this.contractorsService.getContractorsList({}).subscribe((result) => {					
				this.dataSourcee = result.data;
				this.cd.markForCheck();				
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
		
				this.contractorsService.getContractorsList(dataTablesParameters).subscribe(resp => {
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

	addNewContractor() {
		this.router.navigate(['contractors/addedit']);
		// this.dialog.open(DialogDataExampleDialog);
	}

	deleteContractor(contractorId : any){

		this.contractorsService .deleteContractor({'contractorId' : contractorId}).subscribe((result) => {					
			this.getContractorsList();		
		},
		err => {

		});
		
		
	}

}
