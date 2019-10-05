import { Component, OnInit, Input , ViewChild , ChangeDetectorRef, ViewEncapsulation} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import { ClientsService } from '../../../clients/clients.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {NgForm} from '@angular/forms';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

import { TranslationService } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

import { CommonService } from './../../../../../services/common.service'
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { DataTableDirective } from 'angular-datatables';

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

	clientId : any ;

	@ViewChild(DaterangePickerComponent)
	public date_of_expiryPicker: DaterangePickerComponent;
	public valid_from: DaterangePickerComponent;
	public dayPicker: DaterangePickerComponent;

	clientOrderIdsList : any = [];
	orderExistIds : any  = [];
	deletedOrderIds : any = [];

	priceBasisList : any = [];

  	constructor(private clientService: ClientsService,
				private route: ActivatedRoute,
			    public router: Router , private fb: FormBuilder,
				private modalService: NgbModal,
				private translate: TranslateService, private transServ : TranslationService,
				private commonService : CommonService,
				private cd : ChangeDetectorRef
				)
	{

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

		const allParams = this.route.snapshot.params;

		if(allParams && allParams.clientId !==""){
			this.clientId = allParams.clientId;
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
		console.log(this.date_of_expiryPicker);

		this.dataTableCall();
	}

	ngOnChanges() {

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
			// 		this.clientOrderIdsList.push(resp.newOrderId);
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
			this.clientOrderIdsList.push($event);
			// console.log(this.clientOrderIdsList);

			this.addedNewOrder();
		}



	}


	addedNewOrder(){
		if(this.clientOrderIdsList.length > 0){
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
		// 	// this.newclientId = result.newclientId;
		// 	// this.cd.markForCheck();
		// });
    }

	deleteTour(i){
		let index = parseInt(i);
		if (index > -1) {
			this.tourList.splice(index, 1);
		}

	}

	gettourList(){
		return this.tourList;
	}



	date_of_expirySelect(value: any, datepicker?: any){

		let start = value.start;
		// let date_of_expiry = this.commonService.transformDate(start, 'yyyy-MM-dd');
		// this.tourFrm.controls[`date_of_expiry`].setValue(date_of_expiry);

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


	deleteClientOrder(ccpid , pid){

		let clientCOId = parseInt(ccpid);
		let clientOId = parseInt(pid);

		if (clientCOId > 0) {
			// this.clientService.deleteClientOrder({clients_orderId : clientCOId }).subscribe(result => {
			// 	this.refeshTable();
			// });

			this.deletedOrderIds.push(clientOId);
			this.refeshTable();

		}
		else if(clientOId  > 0){
			var index = this.clientOrderIdsList.indexOf(clientOId);
			if (index > -1) {
				this.clientOrderIdsList.splice(index, 1);
				this.refeshTable();
			}
		}


	}


	getClientOrderData(){
		return { 'newOrderIds' : this.clientOrderIdsList, 'deleteClientOrders' : this.deletedOrderIds  }
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
			dataTablesParameters.search.clientId= this.clientId;
			dataTablesParameters.search.newOrderIds= this.clientOrderIdsList;
			dataTablesParameters.search.deletedOrderIds =this.deletedOrderIds;
			this.clientService.getOrderList(dataTablesParameters).subscribe(resp => {
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
