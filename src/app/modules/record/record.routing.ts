import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './config/auth.guard';

import { RecordComponent } from './components/record.component';
import { RecordAuthComponent } from './components/record.auth.component';

const routes: Routes = [
  { path: '', component: RecordComponent, canActivate: [AuthGuard], redirectTo: 'auth' },
  { path: 'auth', component: RecordAuthComponent}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
