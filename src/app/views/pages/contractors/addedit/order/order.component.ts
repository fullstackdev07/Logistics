import { Component, OnInit, Input , ViewChild , ChangeDetectorRef } from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {NgForm} from '@angular/forms';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

import { TranslationService } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

import { CommonService } from './../../../../../services/common.service'
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { DataTableDirective } from 'angular-datatables';

import { ContractorsService } from './../../contractors.service';

@Component({
  selector: 'kt-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

	modalReference : any;

	public tour: any = { };
	editindex : any = null;

	// @ViewChild("createTourForm") tourFrm: NgForm;
	tourList : any = [];

	@Input() orderIdsList;

	tourFrm  : FormGroup;

	orderTypeList : any =[];

	dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective)
	datatableElement: DataTableDirective;

	contractorId : any ;

	@ViewChild(DaterangePickerComponent)
	public date_of_expiryPicker: DaterangePickerComponent;
	public valid_from: DaterangePickerComponent;
	public dayPicker: DaterangePickerComponent;

	contractorOrderIdsList : any = [];
	orderExistIds : any  = [];
	deletedOrderIds : any = [];

	priceBasisList : any = [];
  	constructor(
				private route: ActivatedRoute,
			    public router: Router , private fb: FormBuilder,
				private modalService: NgbModal,
				private translate: TranslateService, private transServ : TranslationService,
				private commonService : CommonService , private contractorsService : ContractorsService,
				private cd : ChangeDetectorRef
				)
	{

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

		const allParams = this.route.snapshot.params;

		if(allParams && allParams.contractorId !==""){
			this.contractorId = allParams.contractorId;
		}

		this.translate.get(['priceBasisList' , 'orderTypeList']).subscribe(res=> {
			this.priceBasisList = res['priceBasisList'];
			this.orderTypeList = res['orderTypeList'];
		});

	}

	ngOnInit() {
		this.tourFrm = this.fb.group({
			'order_number': ['1' , Validators.required],
			'description' : [''  , Validators.required ],
			'client_price': ['' , Validators.required],
			'price_basis': ['' , Validators.required],
			'day' : ['' , Validators.required],
			'order_type' : ['', Validators.required],
			'comment' : ['', Validators.required],
			'valid_from' : ['', Validators.required],
			'date_of_expiry' : ['', Validators.required],
			'contractor' : ['', Validators.required],
			'contractor_price_week' : ['', Validators.required],
			'contractor_price_weeken' : ['', Validators.required],
			'status' : [0]
		});

		// this.orderTypeList =  this.commonService.orderTypeList();
		this.valid_from = this.commonService.dateRancePickerOptions();
		this.dayPicker = this.commonService.dateRancePickerOptions();
		this.date_of_expiryPicker = this.commonService.dateRancePickerOptions();
		// console.log(this.date_of_expiryPicker);
		this.dataTableCall();

	}

	ngOnChanges() {
		// console.log(this.basicData);
		if(this.orderIdsList && this.orderIdsList!==undefined){
			console.log(" orderIdsList ", this.orderIdsList);

			if(this.orderIdsList && this.orderIdsList.length >0){
				for (const pdid of this.orderIdsList) {
					this.orderExistIds.push(pdid.orderId);
				}
			}

			// this.presonIds = this.presonIdsList;
			// console.log(" this.personIdsExist ", this.personIdsExist);

		}
	}

    submit(form: NgForm){

		let frmdata = this.tourFrm.value;

		if(this.tourFrm.valid){

			// this.commonService.addeditOrder(frmdata).subscribe(resp => {
			// 	if(resp){
			// 		this.contractorOrderIdsList.push(resp.newOrderId);
			// 		this.addedNewOrder();
			// 	}
			// });


			this.modalClose();

		}else{
			$("#tourFrm").addClass("validateFrm");
		}



	}

    receiveOrderIdsList($event){
		// console.log($event);
		if($event && $event >0){
			this.contractorOrderIdsList.push($event);
			// console.log(this.contractorOrderIdsList);
			this.orderExistIds.push($event);
			this.addedNewOrder();
		}



	}


	addedNewOrder(){
		if(this.contractorOrderIdsList.length > 0){
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
				this.modalClose();
			});
		}

	}

    modalClose(){
		this.editindex = null;
		this.modalReference.close();
		this.tour = {};
		// this.setFormData();
	}


	addOrder(content) {
		this.newNumber();
		this.modalReference = this.modalService.open(content, { centered: true , size: 'lg' , backdrop : 'static' });
	}

	newNumber(){
		// this.commonService.getNewOrderNo().subscribe(result => {
		// 	this.tourFrm.controls[`order_number`].setValue(result.newordersId);
		// 	// this.newcontractorId = result.newcontractorId;
		// 	// this.cd.markForCheck();
		// });
    }



	gettourList(){
		return this.tourList;
	}



	date_of_expirySelect(value: any, datepicker?: any){

		let start = value.start;
		let date_of_expiry = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.tourFrm.controls[`date_of_expiry`].setValue(date_of_expiry);

	}

	valid_fromSelect(value: any, datepicker?: any){

		let start = value.start;
		let valid_from = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.tourFrm.controls[`valid_from`].setValue(valid_from);

	}

	dayPickerSelect(value: any, datepicker?: any){
		let start = value.start;
		let day = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.tourFrm.controls[`day`].setValue(day);
	}


	deleteContractorOrder(ccpid , pid){

		let contractorCOId = parseInt(ccpid);
		let contractorOId = parseInt(pid);

		if (contractorCOId > 0) {
			// this.contractorService.deletecontractorOrder({contractors_orderId : contractorCOId }).subscribe(result => {
			// 	this.refeshTable();
			// });

			this.deletedOrderIds.push(contractorOId);

			var index2 = this.orderExistIds.indexOf(contractorOId);
			if (index2 > -1) {
				this.orderExistIds.splice(index2, 1);
				this.refeshTable();
			}


			this.refeshTable();

		}
		else if(contractorOId  > 0){
			var index = this.contractorOrderIdsList.indexOf(contractorOId);
			if (index > -1) {
				this.contractorOrderIdsList.splice(index, 1);
				this.refeshTable();
			}
		}


	}


	getContractorOrderData(){
		return { 'newOrderIds' : this.contractorOrderIdsList, 'deleteContractorOrders' : this.deletedOrderIds  }
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
			dataTablesParameters.search.contractorId= this.contractorId;
			dataTablesParameters.search.newOrderIds= this.contractorOrderIdsList;
			dataTablesParameters.search.deletedOrderIds =this.deletedOrderIds;
			this.contractorsService.getOrderList(dataTablesParameters).subscribe(resp => {
			  this.response = resp;
			  if(this.response && this.response.data){
				this.tourList = this.response.data;
				//   console.log(this.tourList);
				  this.cd.markForCheck();
				  callback({
					recordsTotal: this.response.recordsTotal,
					recordsFiltered: this.response.recordsFiltered,
					data: []
				  });

				  // this.spinner.hide();
			  }

			});
		}
	  };
	}

	refeshTable(){
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

}
