import {Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../services/user.service';
import { NgForm } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../../../services/lang.service';

import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { TranslationService } from '../../../../../core/_base/layout';

@Component({
  selector: 'kt-banking',
  templateUrl: './banking.component.html',
  styleUrls: ['./banking.component.scss']
})
export class BankingComponent implements OnInit {

  public bankingFrm: FormGroup;

	@Input() bankingDatas;
	@Output() changeFormData = new EventEmitter<boolean>();

	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,  private transServ : TranslationService ) {
			let current_lng = this.transServ.getSelectedLanguage();
			this.translate.use(current_lng);
	}

	ngOnInit() {

		// console.log(this.basicData);
		this.changeFormData.emit(true);
		this.bankingFrm = this.fb.group({
			'account' : [''],
			'bank_code': ['' ],
			'bank_name' : ['' ],
			'iban': ['' ],
			'bic': ['' ],
			'dtaus_no' : ['' ],
			'usage': ['' ],
			'dtaus_path' : ['' ],
			'sepa': ['' ],
			'converter': ['' ],
			'sepa_path': ['' ],
			'sepa_no': ['' ]
		});

		this.bankingFrm.valueChanges.subscribe(val => {
			if(val.account !== "" ||
				val.bank_code !== "" ||
				val.bank_name !== "" ||
				val.iban !== "" ||
				val.bic !== "" ||
				val.dtaus_no !== "" ||
				val.usage !== "" ||
				val.dtaus_path !== "" ||
				val.sepa !== "" ||
				val.converter !== "" ||
				val.sepa_path !== "" ||
				val.sepa_no !== ""){
					this.changeFormData.emit(false);
				}else {
					this.changeFormData.emit(true);
				}
		});
	}

	ngOnChanges() {

		// console.log(" bankingData " , this.bankingDatas);
		if(this.bankingDatas && this.bankingDatas!==undefined){
			for (var key in this.bankingDatas) {
				if (this.bankingDatas.hasOwnProperty(key) && key !=='company_bankingId' && key !=='companyId') {

					let value = (this.bankingDatas[key] && this.bankingDatas[key]!=undefined && this.bankingDatas[key]!==null) ? this.bankingDatas[key] : '';

					console.log(key + " -> " + value);

					this.bankingFrm.controls[`${key}`].setValue(value);

				}
			}
    }

	}

	formData(){

		if(this.bankingFrm.valid){
			// return this.bankingFrm.value;
			let fromData = this.bankingFrm.value;
			return fromData;

		}
		else{
			$("#bankingFrm").addClass("validateFrm");
			return false;
		}

		// return this.bankingFrm.value;
	}

}
