import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-incomplete-form-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule], // Import Angular Material modules here
  templateUrl: './incomplete-form-dialog.component.html',
})
export class IncompleteFormDialogComponent {}
