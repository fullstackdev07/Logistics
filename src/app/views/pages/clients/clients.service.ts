import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(public http: HttpClient) {}


  public addeditClient(data): Observable<any> {
    // console.log(data);
    // return ;
    // console.log(environment.apiUrl);
    
		return this.http.post(`${environment.apiUrl}addeditClient`, data);
  }



  public getClientsList(data): Observable<any> {
		return this.http.post(`${environment.apiUrl}clientsList`, data);
  }

  
  public getAllClients(data : any = {}): Observable<any> {
		return this.http.get(`${environment.apiUrl}getclientList`, data);
  }
  
  public getClientDetails(data : any ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getClientDetails`, {params:data});
  }
  
  public deleteClient(data : any ): Observable<any> {
		return this.http.get(`${environment.apiUrl}deleteClient`, {params:data});
  }

  public getNewClientNo( ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getNewClientNo`, {});
  }

  public getPersonList (data) : Observable<any> {
    return this.http.post(`${environment.apiUrl}clientPersonList`, data);
  }
  
  public deleteClientPerson(data) : Observable<any> {
    return this.http.post(`${environment.apiUrl}deleteClientPerson`, data);
  }

  public getOrderList (data) : Observable<any> {
    return this.http.post(`${environment.apiUrl}clientOrderList`, data);
  }
  
  public deleteClientOrder(data) : Observable<any> {
    return this.http.post(`${environment.apiUrl}deleteClientOrder`, data);
  }
}
