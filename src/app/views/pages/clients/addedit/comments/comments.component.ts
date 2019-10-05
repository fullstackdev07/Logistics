import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import * as $ from 'jquery';

@Component({
  selector: 'kt-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {

	commentFrm : FormGroup;

	@Input() comments;
	@Output() changeFormData = new EventEmitter<boolean>();

  	constructor(private fb: FormBuilder) {
	}

	ngOnInit() {

		this.changeFormData.emit(true);
		this.commentFrm = this.fb.group({
			'comment': ['']
		});

		this.commentFrm.valueChanges.subscribe(val => {
			if(val.comment !== ""){
				this.changeFormData.emit(false);
			}else {
				this.changeFormData.emit(true);
			}
		});

	  }


	ngOnChanges() {
		// console.log(this.basicData);
		if(this.comments && this.comments!==undefined){
			this.commentFrm.controls['comment'].setValue(this.comments);
		}
	  }

	getComment(){

		if(this.commentFrm.valid){

			console.log(this.commentFrm.value);


			return this.commentFrm.value;
		}
		else{
			console.log("aaa ffff");
			$("#commentFrm").addClass("validateFrm");
			return false;
		}

	}




}
