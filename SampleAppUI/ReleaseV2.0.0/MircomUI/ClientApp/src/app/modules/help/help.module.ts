import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './help.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HelpComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [HelpComponent ]
})
export class HelpModule { }
