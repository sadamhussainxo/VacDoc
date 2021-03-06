import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class VacationService extends BaseService {

  private readonly API_VACATION = `${environment.BASE_URL}schedule/add-vacation`;

  constructor(
    protected http: HttpClient
  ) { super(http); }

  addVaccation(data): Observable<any> {
    const url = `${this.API_VACATION}`;
    return this.http.post(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

}
