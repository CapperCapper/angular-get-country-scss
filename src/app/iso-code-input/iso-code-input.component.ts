import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, tap } from 'rxjs/operators';

import { CountryInfo } from '../country-info';
import { CountryService } from '../country.service';

@Component({
  selector: 'app-iso-code-input',
  templateUrl: './iso-code-input.component.html',
  styleUrls: ['./iso-code-input.component.scss'],
})
export class IsoCodeInputComponent implements OnInit {
  isoInput: FormControl;
  countryInfo$: Observable<CountryInfo>;
  getCountryInfo$: Observable<any>;
  showInvalidCodeErrorMessage: boolean;

  constructor(private countryService: CountryService) {}

  ngOnInit() {
    this.isoInput = new FormControl('', [
      Validators.required,
      Validators.maxLength(3),
    ]);

    this.isoInput.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      this.showInvalidCodeErrorMessage = false;
    });
  }

  submit() {
    if (this.isoInput.valid) {
      this.showInvalidCodeErrorMessage = false;
      this.countryInfo$ = this.countryService
        .getCountry(this.isoInput.value)
        .pipe(
          tap((err) => {
            if (!!err[0].message && err[0].message[0].id === '120') {
              console.error(err[0].message[0].value);
              this.showInvalidCodeErrorMessage = true;
            }
          }),
          map((country) => {
            if (!!country[1]) {
              const allInfo = country[1][0];
              const countryInfo = {
                iso2Code: allInfo.iso2Code,
                countryName: allInfo.name,
                region: allInfo.region.value,
                capitalCity: allInfo.capitalCity,
                longitude: allInfo.longitude,
                latitude: allInfo.latitude,
              };
              return countryInfo;
            } else {
              return null;
            }
          })
        );
    }
  }
}
