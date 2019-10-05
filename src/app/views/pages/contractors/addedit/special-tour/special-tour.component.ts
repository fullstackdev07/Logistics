import { Component, OnInit , Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

import { TranslationService } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-special-tour',
  templateUrl: './special-tour.component.html',
  styleUrls: ['./special-tour.component.scss']
})
export class SpecialTourComponent implements OnInit {

  specialtour : any = {};

  specialtourFrm : FormGroup;

  @Input() specialtourData;
  @Output() changeFormData = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder , private translate: TranslateService, private transServ : TranslationService) {
    let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

   }

  ngOnInit() {
	this.changeFormData.emit(true);
    this.specialtourFrm = this.fb.group({
      'description': ['' ],
      'days': ['' ],
      'client_price': [''],
      'contractors_price': [''],
      'contractors': ['']

		});

		this.specialtourFrm.valueChanges.subscribe(val => {
			if(val.description !== "" ||
				val.days !== "" ||
				val.client_price !== "" ||
				val.contractors_price !== "" ||
				val.contractors !== ""){
					this.changeFormData.emit(false);
				}else {
					this.changeFormData.emit(true);
				}
		});
  }

  ngOnChanges() {
		// console.log(this.basicData);
		if(this.specialtourData && this.specialtourData!==undefined){
      let description = this.specialtourData.description;
      let days = this.specialtourData.days;
      let client_price = this.specialtourData.client_price;
      let contractors_price = this.specialtourData.contractors_price;
      let contractors = this.specialtourData.contractors;

      this.specialtourFrm.controls['description'].setValue(description);
      this.specialtourFrm.controls['days'].setValue(days);
      this.specialtourFrm.controls['client_price'].setValue(client_price);
      this.specialtourFrm.controls['contractors_price'].setValue(contractors_price);
      this.specialtourFrm.controls['contractors'].setValue(contractors);

    }
  }
	getSpecialtour(){


		if(this.specialtourFrm.valid){

			return this.specialtourFrm.value;

		}else{
      $("#specialtourFrm").addClass("validateFrm");
			return false;
		}
		// return this.specialtourFrm.value;
	}

}
