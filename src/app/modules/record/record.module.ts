import { NgModule } from '@angular/core';

import { RecordComponent }   from './components/record.component';
import { RecordAuthComponent } from './components/record.auth.component';
import { routing } from './record.routing';
import { AuthGuard } from './config/auth.guard';

@NgModule({
  imports: [routing],
  providers: [AuthGuard],
  declarations: [RecordComponent, RecordAuthComponent]
})
export class RecordModule {}