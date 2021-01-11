import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { IsoCodeInputComponent } from './iso-code-input/iso-code-input.component';
import { CountryService } from './country.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule ],
  declarations: [ AppComponent, HelloComponent, IsoCodeInputComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ CountryService]
})
export class AppModule { }
