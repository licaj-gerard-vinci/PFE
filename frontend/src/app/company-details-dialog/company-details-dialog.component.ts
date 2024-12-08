import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type EditModeFields = 'nom_entreprise' | 'adresse_mail' | 'code_nace_principal' | 'chiffre_affaire_du_dernier_exercice_fiscal' | 'nombre_travailleurs';

@Component({
  selector: 'app-company-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './company-details-dialog.component.html',
  styleUrls: ['./company-details-dialog.component.scss'],
})
export class CompanyDetailsDialogComponent implements OnInit {
  @Output() companyUpdated = new EventEmitter<void>();

  company: any = {
    nom_entreprise: '',
    adresse_mail: '',
    code_nace_principal: '',
    chiffre_affaire_du_dernier_exercice_fiscal: 0,
    nombre_travailleurs: 0,
    id_templates: [] // Initialize as an empty array for multiple templates
  }; // Initialize the company object with default values
  templates: any[] = []; // Initialize the templates array
  editMode: { [key in EditModeFields]: boolean } = {
    nom_entreprise: false,
    adresse_mail: false,
    code_nace_principal: false,
    chiffre_affaire_du_dernier_exercice_fiscal: false,
    nombre_travailleurs: false
  };

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<CompanyDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.http.get(`http://localhost:8000/api/companies/${this.data.id}/`).subscribe((data: any) => {
      this.company = data;
      this.company.id_templates = data.id_templates ? data.id_templates.map((template: any) => template.id_template) : []; // Extract template IDs or initialize as empty array
    });
  
    this.http.get('http://localhost:8000/api/templates/').subscribe((data: any) => {
      this.templates = data;
    });
  }

  toggleEditMode(field: EditModeFields): void {
    this.editMode[field] = !this.editMode[field];
  }

  saveChanges(): void {
    // Ensure id_templates is an array
    if (!Array.isArray(this.company.id_templates)) {
      this.company.id_templates = [];
    }
  
    // Ensure id_templates are objects
    this.company.id_templates = this.company.id_templates.map((id_template: number) => {
      return this.templates.find(template => template.id_template === id_template);
    });
  
    console.log('Data being sent to the server:', this.company); // Log the data being sent
    this.http.put(`http://localhost:8000/api/companies/${this.data.id}/update/`, this.company).subscribe(
      (response) => {
        console.log('Company details updated successfully', response);
        this.companyUpdated.emit(); // Emit the event
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error updating company details', error);
        console.error('Server response:', error.error); // Log the server response
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}