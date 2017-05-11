import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'dateFilter'
})
@Injectable()
export class DateFilterPipe implements PipeTransform {
    constructor() { }

    transform(items, day) {
        if (!day) { return items; }

        let filterDay = new Date(day);

        return items.filter(fixture => {
            if (fixture && fixture.date) {
                let date = new Date(fixture.date);
                return date.getDay() === filterDay.getDay() && date.getMonth() === filterDay.getMonth();
            }
        });
    }
}
