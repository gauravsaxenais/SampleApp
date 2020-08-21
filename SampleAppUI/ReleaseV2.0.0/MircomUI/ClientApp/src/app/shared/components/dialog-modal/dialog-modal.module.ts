import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModalComponent } from './dialog-modal.component';
import { MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [DialogModalComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    TranslateModule
  ],
  exports: [DialogModalComponent],
  entryComponents: [DialogModalComponent]
})
export class DialogModalModule { }
