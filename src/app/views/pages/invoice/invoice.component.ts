import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef , ViewChild} from '@angular/core';
import { MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import * as html2pdf from 'html2pdf.js';  
@Component({
  selector: 'kt-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

    headerLogo: string;

    @ViewChild('content') content: ElementRef;

	constructor(
		
	) {

	

	 }

	ngOnInit() {
        this.headerLogo = './assets/media/logos/logo.png';
    }
    
    savePdf(){ 
        html2pdf(this.content.nativeElement);
      }

	
}
