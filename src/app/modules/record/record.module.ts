import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RecordComponent }   from './components/record.component';
import { RecordLoginComponent } from './components/record.login.component';
import { RecordRegisterComponent } from './components/record.register.component';
import { routing } from './record.routing';
import { AuthGuard } from './config/auth.guard';

import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';

@NgModule({
  imports: [FormsModule, CommonModule, routing],
  providers: [AuthGuard, LoginService, UserService],
  declarations: [RecordComponent, RecordLoginComponent, RecordRegisterComponent]
})
export class RecordModule {}
