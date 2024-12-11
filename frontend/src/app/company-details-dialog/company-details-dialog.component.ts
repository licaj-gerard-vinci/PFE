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
import { MatRadioModule } from '@angular/material/radio';

type EditModeFields = 'nom_entreprise' | 'adresse_mail' | 'code_nace_activite_principal' | 'chiffre_affaire_du_dernier_exercice_fiscal' | 'nombre_travailleurs';

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
    FormsModule,
    MatRadioModule
  ],
  templateUrl: './company-details-dialog.component.html',
  styleUrls: ['./company-details-dialog.component.scss'],
})

export class CompanyDetailsDialogComponent implements OnInit {
  @Output() companyUpdated = new EventEmitter<void>();

  company: any = {
    nom_entreprise: '',
    email: '',
    code_nace_activite_principal: '',
    chiffre_affaire_du_dernier_exercice_fiscal: 0,
    nombre_travailleurs: 0,
    est_valide: 'N/D',
    id_templates: [],
    raison_refus: ''
  }; 
  templates: any[] = [];
  editMode: { [key in EditModeFields]: boolean } = {
    nom_entreprise: false,
    adresse_mail: false,
    code_nace_activite_principal: false,
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

      // Mark associated templates as selected
      const clientTemplateIds = this.company.templates.map((template: any) => template.id_template);
      this.templates.forEach((template) => {
        template.selected = clientTemplateIds.includes(template.id_template);
      });
    });

    this.http.get('http://localhost:8000/api/templates/').subscribe((data: any) => {
      this.templates = data;
    });
  }

  saveChanges(): void {
    // Ensure id_templates is an array
    this.company.id_templates = this.templates
      .filter((template) => template.selected) // Only include selected templates
      .map((template) => template.id_template);

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