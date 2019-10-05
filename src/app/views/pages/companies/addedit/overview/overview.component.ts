import {Component, Input, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../services/user.service';
import { NgForm } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

import { TranslationService } from '../../../../../core/_base/layout';

import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

import { CompaniesService } from './../../companies.service';
import { CommonService } from './../../../../../services/common.service'
import { DaterangePickerComponent } from 'ng2-daterangepicker';

@Component({
  selector: 'kt-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

	public overviewData: FormGroup;

	@Input() basicData;

	@ViewChild(DaterangePickerComponent)
	public last_rech_date: DaterangePickerComponent;

	@Output() changeFormData = new EventEmitter<boolean>();


	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,  private transServ : TranslationService ,
		private companiesService :  CompaniesService , private commonService : CommonService ) {
			let current_lng = this.transServ.getSelectedLanguage();
			this.translate.use(current_lng);
	}

	ngOnInit() {

		this.changeFormData.emit(true);
		this.overviewData = this.fb.group({
			'companyId' : [''],
			'company_number': ['' , Validators.required],
			'group_name' : ['' , Validators.required],
			'name1': ['' , Validators.required],
			'name2': ['' , Validators.required],
			'street' : ['' , Validators.required],
			'postcode': ['' , Validators.required],
			// 'place' : ['' , Validators.required],
			'phone1': ['' , Validators.required],
			'phone2': ['' , Validators.required],
			// 'mobile': ['' , Validators.required],
			'fax': ['' , Validators.required],
			// 'email': ['' , Validators.required],
			'ustr_mandatory': ['' ],
			'ustr_mandatory_value': ['' ],
			'invoice_number': ['' , Validators.required],
			'num_invoice': ['' , Validators.required],
			'num_r_branch': ['' , Validators.required],
			'last_set_position': ['' , Validators.required],
			'ag_ltp_number': ['' , Validators.required],
			'prefix_client' : ['' , Validators.required],
			'prefix_power_partner': ['' , Validators.required],
			'last_rech_date': ['', Validators.required]
		});

		this.overviewData.valueChanges.subscribe(val => {
			if(val.group_name !== "" ||
				val.name1 !== "" ||
				val.name2 !== "" ||
				val.street !== "" ||
				val.postcode !== "" ||
				val.place !== "" ||
				val.phone1 !== "" ||
				val.phone2 !== "" ||
				val.fax !== "" ||
				val.vat_fully !== "" ||
				val.vat_half !== "" ||
				val.invoice_number !== "" ||
				val.num_invoice !== "" ||
				val.num_r_branch !== "" ||
				val.last_set_position !== "" ||
				val.ag_ltp_number !== "" ||
				val.prefix_client !== "" ||
				val.prefix_power_partner !== "" ||
				val.last_rech_date !== ""){
					this.changeFormData.emit(false);
				}else {
					this.changeFormData.emit(true);
				}
		});

		const allParams = this.route.snapshot.params;

		// console.log(allParams);

		this.last_rech_date = this.commonService.dateRancePickerOptions();


		if(allParams){
			if(allParams.companyId ===undefined || allParams.companyId===null )  this.newNumber();
		}


    }

	ustr_mandatory_disabled = true;

	ngOnChanges() {
		// console.log(this.basicData);
		if(this.basicData && this.basicData!==undefined){

			for (var key in this.basicData) {
				if (this.basicData.hasOwnProperty(key) && key !=='status' && key !=='created_time' && key !=='updated_time' ) {
					// console.log(key);

					let value = (this.basicData[key] && this.basicData[key]!=undefined && this.basicData[key]!==null) ? this.basicData[key] : '';
					this.overviewData.controls[`${key}`].setValue(value);
					if(key!=='ustr_mandatory'){
						this.ustr_mandatory_disabled = ((value!==1) ? false : true);
					}
					// console.log(key + " -> " + data[key]);
				}
			}

		}

	}

	formData(){

		// console.log(this.overviewData.value);


		if(this.overviewData.valid){

			let fromData = this.overviewData.value;
			return fromData;

		}
		else{
			$("#overviewData").addClass("validateFrm");
			return false;
		}


	}

	newNumber(){
		this.companiesService.getNewCompanyNo().subscribe(result => {
			this.overviewData.controls[`company_number`].setValue(result.newcompanyId);
			// this.newclientId = result.newclientId;
			// this.cd.markForCheck();
		})
	}

	changeuStrMandatory(){
		this.ustr_mandatory_disabled = !this.ustr_mandatory_disabled;
	}


	last_rech_dateSelect(value: any, datepicker?: any){

		let start = value.start;
		let last_rech_date = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.overviewData.controls[`last_rech_date`].setValue(last_rech_date);

	}
}
