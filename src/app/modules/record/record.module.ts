import { NgModule } from '@angular/core';

import { RecordComponent }   from './record.component';
import { routing } from './record.routing';

@NgModule({
  imports: [routing],
  declarations: [RecordComponent]
})
export class RecordModule {}