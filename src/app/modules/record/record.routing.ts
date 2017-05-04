import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './config/auth.guard';

import { RecordComponent } from './record.component';

const routes: Routes = [
  { path: '', component: RecordComponent, canActivate: [AuthGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);