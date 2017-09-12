import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TuringmachineService} from "./service/turingmachineservice.service";
import {AboutComponent} from "./turing-machine/about/about.component";
import {ChartComponent} from "./turing-machine/chart/chart.component";
import {TsAnimationComponent} from "./turing-machine/ts-animation/ts-animation.component";
import {EditorComponent} from "./turing-machine/editor/editor.component";
import {LoadExampleComponent} from "./turing-machine/load-example/load-example.component";
import {TuringMachineComponent} from "./turing-machine/turing-machine.component";
import {ChartsModule} from "ng2-charts";
import {FormsModule} from "@angular/forms";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    AboutComponent,
    TsAnimationComponent,
    EditorComponent,
    LoadExampleComponent,
    TuringMachineComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    SortableModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [TuringmachineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
