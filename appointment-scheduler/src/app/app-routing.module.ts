import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialistsComponent } from './specialists/specialists.component';
import { ChartsComponent } from './charts/charts.component';

const routes: Routes = [
  { path: '', redirectTo: '/specialists', pathMatch: 'full' },
  { path: 'specialists', component: SpecialistsComponent },
  { path: 'charts', component: ChartsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }





