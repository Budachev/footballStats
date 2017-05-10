import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './config/auth.guard';

import { RecordComponent } from './components/record.component';
import { RecordLoginComponent } from './components/record.login.component';
import { RecordRegisterComponent } from './components/record.register.component';

const routes: Routes = [
  { path: '', component: RecordComponent, canActivate: [AuthGuard] },
  { path: 'login', component: RecordLoginComponent},
  { path: 'register', component: RecordRegisterComponent}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
