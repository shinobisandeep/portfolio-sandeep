import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule,MatFormFieldControl } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuItem } from '@angular/material/menu';
@NgModule({
 imports:[MatInputModule,
  MatMenuModule,
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatDialogModule,MatProgressSpinnerModule],
  exports:[
  MatMenuModule,
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatMenuItem,
  MatInputModule

  ]
})
export class AngularMaterialModule{

}
