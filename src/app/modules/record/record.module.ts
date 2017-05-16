import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RecordComponent }   from './components/record.component';
import { routing } from './record.routing';
import { AuthGuard } from './config/auth.guard';

import { UserService } from './services/user.service';

@NgModule({
  imports: [FormsModule, CommonModule, routing],
  providers: [AuthGuard, UserService],
  declarations: [RecordComponent]
})
export class RecordModule {}
