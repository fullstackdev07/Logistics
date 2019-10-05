import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef , ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';

import { PersonsService } from './../persons.service';
import { TranslationService } from '../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';

class Tdata { }

@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  personList : any = [];
  personId : any ;

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
    public router: Router,private cd: ChangeDetectorRef,
    private personsService : PersonsService,
    private translate: TranslateService, private transServ : TranslationService
    ) { 
          let current_lng = this.transServ.getSelectedLanguage();
          this.translate.use(current_lng);
    }

  ngOnInit() {
    this.dataTableCall();
    this.cd.markForCheck();
  }


  
  addNewPerson() {
		this.router.navigate(['persons/addedit']);
		// this.dialog.open(DialogDataExampleDialog);
  }

  editPerson(id) {
		this.router.navigate(['persons/addedit/'+id]);
		// this.dialog.open(DialogDataExampleDialog);
  }

  deletePerson(personId : any){

    this.personsService.deletePerson({ personsId : personId }).subscribe((result) => {	

      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
        this.cd.markForCheck();
      });
      

    },
    err => {

    });

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
          // dataTablesParameters.search.closed_files=this.dateRange;
          // dataTablesParameters.search.date_fin=this.dateRange_fin;
          // dataTablesParameters.search.date_cls = this.dateRange_cls;

          this.personsService.getPersonList(dataTablesParameters).subscribe(resp => {
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
