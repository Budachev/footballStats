import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordComponent } from './record.component';

const routes: Routes = [
  { path: '', component: RecordComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);