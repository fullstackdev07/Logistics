import {Component, OnInit, ViewChild , Input, ChangeDetectorRef, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatPaginator} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {CustomerModel} from '../../../../../core/e-commerce';
import {ActivatedRoute, Router} from '@angular/router';

import { ClientsService } from './../../../clients/clients.service';
import { TranslationService } from '../../../../../core/_base/layout';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {NgForm} from '@angular/forms';

import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

import { DataTableDirective } from 'angular-datatables';

import { CommonService } from './../../../../../services/common.service';
import {TranslateService} from '@ngx-translate/core';

import * as $ from 'jquery';

@Component({
  selector: 'kt-contact-persion',
  templateUrl: './contact-persion.component.html',
  styleUrls: ['./contact-persion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactPersionComponent implements OnInit {

	@ViewChild("contactPersonForm") contperFrm: NgForm;
	persionList : any = [];

	clientPersonIdsList : any = [];
	personList: any = [];

    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective)
	datatableElement: DataTableDirective;
	
    clientId :any ;
	contactPersons: any;
	
	selection = new SelectionModel<CustomerModel>(true, []);
	name: string;

	modalReference : any;

    contactPersonId = '';
	public contactPerson: any = { };

	editindex : any = null;

	@Input() presonIdsList;
	contactPersonFrm  : FormGroup;

	showForm : any = true;
	salutationList : any = [];
	person_type_list : any = [];

	personIdsExist : any = [];

	constructor(
		private cd: ChangeDetectorRef,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router, private fb: FormBuilder,
		private clientsService : ClientsService ,
		private commonService : CommonService,
		private modalService: NgbModal, private transServ: TranslationService,
		private translate: TranslateService,
		) {

		// this.route.params.subscribe((params) => {			
		// 	this.clientId = params.clientId;			
		// });

		const allParams = this.route.snapshot.params;

		if(allParams && allParams.clientId !==""){
			this.clientId = allParams.clientId;
		}

		this.translate.get(['person_type_list' , 'salutationList']).subscribe(res=> {
			this.person_type_list = res['person_type_list'];
			this.salutationList = res['salutationList']
		});

	}

	ngOnInit() {
		this.contactPersonFrm = this.fb.group({
			'person_number' : [''],
			'type' : ['', Validators.required],
			'salutation': ['' , Validators.required],
			'first_name' : [''  , Validators.required ],
			'surname': ['' , Validators.required],
			'position': ['' , Validators.required],
			'department' : ['' , Validators.required],
			'phone' : ['', Validators.required],
			'mobile_number' : ['', Validators.required],
			'fax' : ['', Validators.required],
			'email' : ['', [ Validators.required , Validators.email]],
			'comment' : ['', Validators.required],
			'status' : [0]
		});
		// this.salutationList = this.commonService.salutationList();
		this.dataTableCall();
	}

	ngOnChanges() {
		// console.log(this.basicData);
		if(this.presonIdsList && this.presonIdsList!==undefined){
			
			if(this.presonIdsList && this.presonIdsList.length >0){
				for (const pdid of this.presonIdsList) {
					this.personIdsExist.push(pdid.personId);
				}
			}

			// this.presonIds = this.presonIdsList;
			// console.log(" this.personIdsExist ", this.personIdsExist);
			
		}
		
	  }
	ngOnDestroy() {}	
	
	newNumber(){
		this.commonService.getNewPersonNo().subscribe(result => {
			this.contactPersonFrm.controls[`person_number`].setValue(result.newpersonsId);
			// this.newclientId = result.newclientId;
			// this.cd.markForCheck();	
		});
   }
	
	submit(form: NgForm){
		// this.contactPersonForm.onSubmit(null);
		// console.log(form.value);
		// let data =  form.value;

		let frmdata = this.contactPersonFrm.value;

		


		if(this.contactPersonFrm.valid){
			this.contactPersonFrm.reset();
			// console.log(frmdata);

			this.commonService.addeditPerson(frmdata).subscribe(resp => {
				if(resp){
					this.clientPersonIdsList.push(resp.newPersonId);
					this.addedNewPerson();
				}
				
			});
			// if(this.editindex!==null){
			// 	this.persionList[this.editindex] = frmdata;
			// }else{

			// 	this.persionList.push(frmdata);
			// }
			
			// console.log(this.persionList);
			this.modalClose();
			
		}else{
			$("#contactPersonFrm").addClass("validateFrm");
		}
		
	}

	modalClose(){
		this.editindex = null;
		this.modalReference.close();
		this.contactPerson = {};
		this.showForm = true;
		// this.setFormData();
	}

	openModal(content) {
		this.newNumber();
		this.modalReference = this.modalService.open(content, { centered: true , size: 'lg' , backdrop : 'static' });
	}

	deletedPersonIds  : any = [];

	deleteContactPerson(ccpid , pid){
		// console.log(ccpid);
		// console.log(pid);

		let clientcPId = parseInt(ccpid);
		let clientPId = parseInt(pid);
		if (clientcPId > 0) {			
			// this.persionList.splice(index, 1);
			this.deletedPersonIds.push(clientPId);
			// this.clientsService.deleteClientPerson({clients_contact_personId : clientcPId }).subscribe(result => {
			// 	this.refeshTable();
			// });
			this.refeshTable();
			
		}
		else if(clientPId  > 0){
			var index = this.clientPersonIdsList.indexOf(clientPId);
			// console.log(index);
			
			if (index > -1) {
				this.clientPersonIdsList.splice(index, 1);
				this.refeshTable();
			}
		}

	}

	getClientPersonData(){
		return { 'newPersonIds' :this.clientPersonIdsList , 'deleteClientPersons' : this.deletedPersonIds  }
	}
	

	changeFrm($event){
		let formName = $event.target.value;
		if(formName=='add'){
			this.showForm = true;
		}else{
			this.showForm = false;
		}
		// console.log($event);
		
	}
	
	refeshTable(){
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}
	

	receivePersonIdsList($event){
		// console.log($event);
		if($event && $event >0){
			this.clientPersonIdsList.push($event);
			console.log(this.clientPersonIdsList);
			
			this.addedNewPerson();
		}

		
		
	}


	addedNewPerson(){		
		if(this.clientPersonIdsList.length > 0){
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
				this.modalClose();
			});
		}

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
			dataTablesParameters.search.newPersonIds= this.clientPersonIdsList;
			dataTablesParameters.search.deletedPersonIds =this.deletedPersonIds;
			this.clientsService.getPersonList(dataTablesParameters).subscribe(resp => {
			  this.response = resp;
			  if(this.response && this.response.data){
				this.personList = this.response.data;
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



}
