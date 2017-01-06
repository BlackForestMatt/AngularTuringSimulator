import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { TuringMachineComponent } from './turing-machine/turing-machine.component';
import { TsAnimationComponent } from './turing-machine/ts-animation/ts-animation.component';

import { EditorComponent } from './turing-machine/editor/editor.component';
import { ChartComponent } from './turing-machine/chart/chart.component';
import { ContaineWidthDirectiveDirective } from './containe-width-directive.directive';
import { LoadExampleComponent } from './turing-machine/load-example/load-example.component';
import { AboutComponent } from './turing-machine/about/about.component';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { ModalModule } from 'angular2-modal';
import {TuringmachineService} from "./service/turingmachineservice.service";

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    TuringMachineComponent,
    TsAnimationComponent,
    EditorComponent,
    ChartComponent,
    EditorComponent,
    ChartComponent,
    ContaineWidthDirectiveDirective,
    LoadExampleComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    BootstrapModalModule,
    ModalModule.forRoot()
  ],
  providers: [TuringmachineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
