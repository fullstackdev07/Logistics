import {Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../services/user.service';
import { NgForm } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../../../services/lang.service';

import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { TranslationService } from '../../../../../core/_base/layout';

@Component({
  selector: 'kt-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

	public invoiceFrm: FormGroup;

	@Input() invoiceData;
	@Output() changeFormData = new EventEmitter<boolean>();

	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
		private languageService: LanguageService , private transServ : TranslationService  ) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {

		this.changeFormData.emit(true);
		this.invoiceFrm = this.fb.group({
			'executive_director' : [''],
			'commercial_register': [''],
			'ust_id' : [''],
			'tax_number': [''],
			'logo_file': [''],
			'logo_position' : [''],
			'website': ['']
		});

		this.invoiceFrm.valueChanges.subscribe(val => {
			if(val.executive_director !== "" ||
				val.commercial_register !== "" ||
				val.ust_id !== "" ||
				val.tax_number !== "" ||
				val.logo_file !== "" ||
				val.logo_position !== "" ||
				val.website !== ""){
					this.changeFormData.emit(false);
				}else {
					this.changeFormData.emit(true);
				}
		});


    }

	ngOnChanges() {
		// console.log(this.invoiceData);
		if(this.invoiceData && this.invoiceData!==undefined){

			console.log(" this.invoiceData ", this.invoiceData);


			for (var key in this.invoiceData) {
				if (this.invoiceData.hasOwnProperty(key) && key !=='company_rechnungsfullId' && key !=='companyId' ) {
					// console.log(key);

					let value = (this.invoiceData[key] && this.invoiceData[key]!=undefined && this.invoiceData[key]!==null) ? this.invoiceData[key] : '';

					console.log(key + " -> " + value);

					this.invoiceFrm.controls[`${key}`].setValue(value);
					// console.log(key + " -> " + data[key]);
				}
			}
		}

	}

	formData(){

		if(this.invoiceFrm.valid){
			// return this.invoiceFrm.value;
			let fromData = this.invoiceFrm.value;
			return fromData;

		}
		else{
			$("#invoiceFrm").addClass("validateFrm");
			return false;
		}


	}

}
