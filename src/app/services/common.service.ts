import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from './../../environments/environment';
import { Observable } from 'rxjs';

import { TranslationService } from '../core/_base/layout';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public http: HttpClient , private transServ : TranslationService , private datepipe: DatePipe ) { }

  getCurrency(){
    return ['EUR', 'CHF', 'DKK', 'USD'];
  }

  getRechRhythm(){
    return ['14 tägig', '7 tägig'];
  }

  getZahlRhythm(){
    return ['14 tägig', '7 tägig'];
  }

  terminationTime(){
    return ['14 Tage', '30 Tage', 'Sonstige' ];
  }

  getStateList(): Observable<any> {
    return this.http.get(`${environment.apiUrl}getStateList`, {});
  }

  public addeditPerson(data): Observable<any> {    
    return this.http.post(`${environment.apiUrl}addeditPerson`, data);
  }
  public getNewPersonNo( ): Observable<any> {
    return this.http.get(`${environment.apiUrl}getNewPersonNo`, {});
  }

  public addeditOrder(data): Observable<any> {    
    return this.http.post(`${environment.apiUrl}addeditOrder`, data);
  }
  public getNewOrderNo( ): Observable<any> {
    return this.http.get(`${environment.apiUrl}getNewOrderNo`, {});
  }


  public dateRangeOption :any   ={
     singleDatePicker: true,
     showDropdowns: true,
     minYear: 1901,
     format:'YYYY-MM-DD',
     autoApply: true,
     autoUpdateInput: false,
     // minDate:'10/12/2018',
     //maxDate:new Date(),
     locale: {
       format: 'YYYY-MM-DD',
       applyLabel: "Sich bewerben",
       cancelLabel: "Rückkehr",
       fromLabel: 'Du',
       toLabel: 'Au',
       weekLabel: 'W',
       customRangeLabel: 'Custom Range',
       daysOfWeek: ["So", "Mo","Di","Do","Fr","Sa","So"],
       monthNames: ["Januar ","Februar","März","April","Mai","Juni","Juli","August","Oktober","Octubre","November","Dezember"],
       firstDay: 1
      },
    //  alwaysShowCalendars: false,
     drops:'down',
 };

  getDate(date){
    if(date) return new Date(date);
  }
  public minDate; public maxDate; public startDate; public endDate;
  public dateRancePickerOptions(minDate='' ,maxDate='',startDate='',endDate=''){
    const datePickerDayMonth : any = this.datePickerDayMonth();

    let monthNames = datePickerDayMonth.months;
    let applyLabel = datePickerDayMonth.apply;
    let cancelLabel = datePickerDayMonth.return;
    let days_of_week = datePickerDayMonth.days_of_week;

    let dateRangeOptionData = JSON.parse(JSON.stringify(this.dateRangeOption));
    dateRangeOptionData.locale.monthNames = monthNames;
    dateRangeOptionData.locale.applyLabel = applyLabel;
    dateRangeOptionData.locale.cancelLabel = cancelLabel;
    dateRangeOptionData.locale.daysOfWeek = days_of_week;

    if(minDate!==null && minDate!==undefined && minDate!=="") {
       this.minDate = this.getDate(minDate);
      dateRangeOptionData.minDate=this.minDate;
    }
    if(maxDate!==null && maxDate!==undefined && maxDate!=="") {
      this.maxDate = this.getDate(maxDate);
      dateRangeOptionData.maxDate=this.maxDate;
    }
    if(startDate!==null && startDate!==undefined && startDate!==""){
      this.startDate = this.getDate(startDate);
      dateRangeOptionData.startDate=this.startDate;
    }
    if(endDate!==null && endDate!==undefined && endDate!=="") {
      this.endDate = this.getDate(endDate);
      dateRangeOptionData.endDate=this.endDate;
    }
    // console.log(" dateRangeOptionData", dateRangeOptionData);
    
    return dateRangeOptionData;
  }

  public datePickerDayMonth= ()=> {
      let crr_lang = this.transServ.getSelectedLanguage();

      if (crr_lang == 'en') {
        return {
            "months": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
            "apply": "Apply",
            "return": "Return",
            "days_of_week": [
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sat"
            ]
        }
      } 
      else if(crr_lang=='ge') {
        return {
          "months": [
            "Januar ",
            "Februar",
            "März",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "Oktober",
            "Octubre",
            "November",
            "Dezember"
          ],
          "apply": "Sich bewerben",
          "return": "Rückkehr",
          "days_of_week": [
            "So",
            "Mo",
            "Di",
            "Do",
            "Fr",
            "Sa",
            "So"
          ]
        }
      }
  }
  

  public transformDate(date, formate = "") {
    let formateType = (formate) ? formate : "yyyy-MM-dd";
    return this.datepipe.transform(date, formateType);
  }

  public paymentstopList(){
    let crr_lang = this.transServ.getSelectedLanguage();
    if(crr_lang=='en'){
      return [{id:1 , value : '1'},{id : 2, value :'Bankruptcy'}]
    }
    else{
      return [{id:1 , value : '1'},{id : 2, value :'Insolvenz'}];
    }
  }


  // public priceBasic(){
  //   let crr_lang = this.transServ.getSelectedLanguage();
  //   if(crr_lang=='en'){
  //     return ['Per day', 'Per stop', 'Per hour', 'Per kilometer']
  //   }
  //   else{
  //     return ['Pro Tag', 'Pro Stopp', 'Pro Stunde', 'Pro Kilometer']
  //   }
  // }


  public orderTypeList(){
    let crr_lang = this.transServ.getSelectedLanguage();
    if(crr_lang=='en'){
      return ['Type1']
    }
    else{
      return ['Type1']
    }
  }


  
}
