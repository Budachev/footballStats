import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';


@Pipe({ name: 'appDate' })
export class appDatePipe implements PipeTransform {
    constructor(private datePipe: DatePipe) { }

    transform(date: string, param: string): string {
        let format = 'dd-MM-yyyy';
        if (param === 'full') {
            format += ' HH:mm';
        }

        return this.datePipe.transform(date, format);
    }
}