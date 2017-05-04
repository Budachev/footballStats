import { NgModule } from '@angular/core';

import { RecordComponent }   from './record.component';
import { routing } from './record.routing';
import { AuthGuard } from './config/auth.guard';

@NgModule({
  imports: [routing],
  providers: [AuthGuard],
  declarations: [RecordComponent]
})
export class RecordModule {}