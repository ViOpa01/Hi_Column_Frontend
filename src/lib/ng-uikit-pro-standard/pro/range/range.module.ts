import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbRangeInputComponent } from './mdb-range.component';
import { NgModule } from '@angular/core';


@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [MdbRangeInputComponent],
    exports: [MdbRangeInputComponent]
})

export class RangeModule {

}
