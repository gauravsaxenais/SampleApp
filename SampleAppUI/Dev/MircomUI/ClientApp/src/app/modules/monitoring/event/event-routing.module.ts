/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventComponent } from './event/event.component';

/**
 * Creates an array of event for child route
 */
const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    data: {
      title: 'event'
    }
  }
];

/**
 * @NgModule decorator with its metadata for event routing
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Create routing module for event
 */
export class EventRoutingModule { }
