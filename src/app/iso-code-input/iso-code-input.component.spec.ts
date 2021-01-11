import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { Observable, of } from 'rxjs';

import { countryMock } from '../country.mock';
import { CountryService } from '../country.service';
import { IsoCodeInputComponent } from './iso-code-input.component';

describe('EmailInputComponent', () => {
  let component: IsoCodeInputComponent;
  let fixture: ComponentFixture<IsoCodeInputComponent>;
  let isoInputEl: DebugElement;
  let isoForm: DebugElement;
  let el: HTMLElement;
  let debugElement: DebugElement;
  let getCountrySpy: Observable<any>;

  beforeEach(
    waitForAsync(() => {
      const countryServiceSpy = jasmine.createSpyObj('CountryService', [
        'getCountry',
      ]);

      getCountrySpy = countryServiceSpy.getCountry.and.returnValue(
        of(countryMock)
      );

      TestBed.configureTestingModule({
        providers: [{ provide: CountryService, useValue: countryServiceSpy }],
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [IsoCodeInputComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IsoCodeInputComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    el = debugElement.nativeElement;

    isoInputEl = debugElement.query(By.css('#iso-input'));
    isoForm = debugElement.query(By.css('#iso-input__form'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display valid results if the ISO code is valid', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'submit').and.callThrough();
    // enter a valid ISO code
    let validCode = 'gb';
    component.isoInput.setValue(validCode);
    isoInputEl.triggerEventHandler('blur', {});
    debugElement.query(By.css('form')).triggerEventHandler('submit', null);

    expect(component.submit).toHaveBeenCalled();
    expect(getCountrySpy).toHaveBeenCalledOnceWith(validCode);

    tick();
    fixture.detectChanges();

    expect(debugElement.query(By.css('.iso-results'))).toBeTruthy();
    // display details of the country if a record is found
    expect(
      debugElement
        .query(By.css('.iso-results--country-name'))
        .nativeElement.textContent.trim()
    ).toBe(countryMock[1][0].name);
    expect(
      debugElement
        .query(By.css('.iso-results--region'))
        .nativeElement.textContent.trim()
    ).toBe(countryMock[1][0].region.value);
    expect(
      debugElement
        .query(By.css('.iso-results--capital'))
        .nativeElement.textContent.trim()
    ).toBe(countryMock[1][0].capitalCity);
    expect(
      debugElement
        .query(By.css('.iso-results--longitude'))
        .nativeElement.textContent.trim()
    ).toBe(countryMock[1][0].longitude);
    expect(
      debugElement
        .query(By.css('.iso-results--latitude'))
        .nativeElement.textContent.trim()
    ).toBe(countryMock[1][0].latitude);
  }));

  it('should display an error message if the ISO code is invalid', () => {
    let invalidCode = '123';
    component.isoInput.setValue(invalidCode);
    isoInputEl.triggerEventHandler('blur', {});
    fixture.detectChanges();
    expect(debugElement.query(By.css('#error--invalid-pattern'))).toBeTruthy();
  });
});
