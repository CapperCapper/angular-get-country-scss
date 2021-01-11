import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

@Injectable()
export class CountryService {
  private API_URL = "https://api.worldbank.org/v2/country/";
  private baseUrl = "https://jsonplaceholder.typicode.com/users";

  constructor(private http: HttpClient) {}

  public getCountry(isoCode: string): Observable<any> {
    const options = { responseType: "text" as "json" };
    return this.http
      .get<any>(this.API_URL + isoCode + "?format=json", options)
      .pipe(
        map(res => JSON.parse(res)),
        catchError(err => {
          return throwError(err);
        })
      );
  }
}
