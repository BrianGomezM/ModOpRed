import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000/api/run-algorithm'

  constructor(private http: HttpClient) {
  }

  modex(valores: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, valores)
  }

}
