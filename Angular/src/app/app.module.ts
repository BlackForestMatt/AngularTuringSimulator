import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { TuringMachineComponent } from './turing-machine/turing-machine.component';
import { TsAnimationComponent } from './turing-machine/ts-animation/ts-animation.component';
import { TsTabComponent } from './turing-machine/ts-animation/ts-tab/ts-tab.component';

import { EditorComponent } from './turing-machine/ts-animation/ts-tab/editor/editor.component';
import { ChartComponent } from './turing-machine/ts-animation/ts-tab/chart/chart.component';
import { ContaineWidthDirectiveDirective } from './containe-width-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    TuringMachineComponent,
    TsAnimationComponent,
    TsTabComponent,
    EditorComponent,
    ChartComponent,
    EditorComponent,
    ChartComponent,
    ContaineWidthDirectiveDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
