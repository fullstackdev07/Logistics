import {Component, OnInit, ViewChild , Input, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {MatDialog, MatPaginator} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {CustomerModel} from '../../../../../core/e-commerce';
import {ActivatedRoute, Router} from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

import {NgForm} from '@angular/forms';
import * as $ from 'jquery';

import { TranslationService } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

import { DataTableDirective } from 'angular-datatables';
import { CommonService } from './../../../../../services/common.service';

import { ContractorsService } from './../../contractors.service';

@Component({
  selector: 'kt-contact-person',
  templateUrl: './contact-person.component.html',
  styleUrls: ['./contact-person.component.scss']
})
export class ContactPersonComponent implements OnInit {
  
  contractorId : any = 0;
  contactPersons: any;
  @ViewChild("contactPersonForm") contperFrm: NgForm;
  personList : any = [];

  
  selection = new SelectionModel<CustomerModel>(true, []);
  name: string;

  modalReference : any;

  contactPersonId = '';
  public contactPerson: any = { };

  editindex : any = null;

  @Input() personIdsList;

  contactPersonFrm  : FormGroup;

  salutationList : any = [];
  person_type_list : any = [];

  personIdsExist : any  = [];
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  contractorPersonIdsList : any = [];



  constructor(
	  public dialog: MatDialog, private cd: ChangeDetectorRef,
	  private route: ActivatedRoute, private fb: FormBuilder,
	  private router: Router,  private modalService: NgbModal,
	  private translate: TranslateService, private transServ : TranslationService,
	  private commonService : CommonService , private contractorsService : ContractorsService
	  ) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

		this.route.params.subscribe((params) => {			
			this.contractorId = params.contractorId;			
		});

		const allParams = this.route.snapshot.params;

		if(allParams && allParams.contractorId !==""){
			this.contractorId = allParams.contractorId;
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


	this.dataTableCall();

  }

  ngOnChanges() {
	// console.log(this.basicData);
	if(this.personIdsList && this.personIdsList!==undefined){
		// console.log(" personIdsList" , this.personIdsList);
		
		if(this.personIdsList && this.personIdsList.length >0){
			for (const pdid of this.personIdsList) {
				this.personIdsExist.push(pdid.personId);
			}
		}

		// this.presonIds = this.presonIdsList;
		// console.log(" this.personIdsExist ", this.personIdsExist);
		
	}
	
  }
	ngOnDestroy() {}	
	
	frmdata : any;
	submit(){


		let frmdata = this.contactPersonFrm.value;

		if(this.contactPersonFrm.valid){
			this.contactPersonFrm.reset();
			
			this.commonService.addeditPerson(frmdata).subscribe(resp => {
				if(resp){
					this.contractorPersonIdsList.push(resp.newPersonId);
					this.addedNewPerson();
				}
				
			});
			
			// console.log(this.personList);
			this.modalClose();
			
		}
		else{
			// console.log(frmdata);
			$("#contactPersonFrm").addClass("validateFrm");
		}
		
		
	}

	modalClose(){
		this.editindex = null;
		this.modalReference.close();
		this.contactPerson = {};
	}

	openModal(content) {
		this.newNumber();
		this.modalReference = this.modalService.open(content, { centered: true , size: 'lg' , backdrop : 'static' });
	}

	newNumber(){
		this.commonService.getNewPersonNo().subscribe(result => {
			this.contactPersonFrm.controls[`person_number`].setValue(result.newpersonsId);
			// this.newclientId = result.newclientId;
			// this.cd.markForCheck();	
		});
   }

	
  

	deletedPersonIds  : any = [];

	deleteContactPerson(ccpid , pid){
		// console.log(ccpid);
		// console.log(pid);

		let personcPId = parseInt(ccpid);
		let personPId = parseInt(pid);
		if (personcPId > 0) {			
			// this.personList.splice(index, 1);
			this.deletedPersonIds.push(personPId);
			// this.personsService.deletepersonPerson({persons_contact_personId : personcPId }).subscribe(result => {
			// 		this.refeshTable();
			// });

			var index2 = this.personIdsExist.indexOf(personPId);
			if(index2 > -1){
				this.personIdsExist.splice(index2, 1);
			}
			
			this.refeshTable();
			
		}
		else if(personPId  > 0){
			var index = this.contractorPersonIdsList.indexOf(personPId);
			// console.log(index);
			var index2 = this.personIdsExist.indexOf(personPId);
			if (index > -1) {
				this.contractorPersonIdsList.splice(index, 1);
				this.refeshTable();
			}

			if(index2 > -1){
				this.personIdsExist.splice(index2, 1);
			}
		}

	}

	getContractorPersonData(){
		return { 'newPersonIds' :this.contractorPersonIdsList , 'deleteContractorPersons' : this.deletedPersonIds  };
	}
	
	showForm = true;
	changeFrm($event){
		let formName = $event.target.value;
		if(formName=='add'){
			this.showForm = true;
		}else{
			this.showForm = false;
		}		
	}
	
	refeshTable(){
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}
	

	receivePersonIdsList($event){
		// console.log($event);
		if($event && $event >0){
			this.contractorPersonIdsList.push($event);
			// console.log(this.contractorPersonIdsList);
			this.personIdsExist.push($event);
			this.addedNewPerson();
		}

		
		
	}


	addedNewPerson(){		
		if(this.contractorPersonIdsList.length > 0){
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
			dataTablesParameters.search.contractorId= this.contractorId;
			dataTablesParameters.search.newPersonIds= this.contractorPersonIdsList;
			dataTablesParameters.search.deletedPersonIds =this.deletedPersonIds;
			this.contractorsService.getPersonList(dataTablesParameters).subscribe(resp => {
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
