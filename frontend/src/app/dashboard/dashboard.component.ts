import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CompanyDetailsDialogComponent } from '../company-details-dialog/company-details-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nom', 'email', 'travailleurs', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.http.get<any[]>('http://localhost:8000/api/companies/').subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return (
          data.nom_entreprise.toLowerCase().includes(filter) ||
          data.adresse_mail.toLowerCase().includes(filter)
        );
      };
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDetails(id: number): void {
    const dialogRef = this.dialog.open(CompanyDetailsDialogComponent, {
      width: '600px',
      data: { id },
    });

    dialogRef.componentInstance.companyUpdated.subscribe(() => {
      this.loadCompanies(); // Refresh the table data
    });
  }
}