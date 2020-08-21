import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { CameraEditComponent } from './camera-edit/camera-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CameraComponent,
    data: {
      title: 'camera'
    }
  },
  {
    path: 'edit-camera',
    component: CameraEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CameraRoutingModule { }
