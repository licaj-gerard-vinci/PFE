import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { CompanyDetailsDialogComponent } from '../company-details-dialog/company-details-dialog.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType, ChartData } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';

Chart.register(...registerables); // Register all necessary chart components

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
    MatBadgeModule,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  displayedColumns: string[] = ['nom', 'email', 'travailleurs', 'est_valide', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  newCompaniesCount: number = 0;

  // Chart configuration
  chartLabels: string[] = ['Valides', 'Refusée', 'N/D'];
  chartData: ChartData<'pie', number[], string> = {
    labels: this.chartLabels,
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#4caf50', '#013238', '#9e9e9e'],
      },
    ],
  };
  chartType: ChartType = 'pie';
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  constructor(private http: HttpClient, public dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.checkForNewCompanies();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCompanies(): void {
    this.http.get<any[]>('http://localhost:8000/api/companies/').subscribe((data) => {
      this.dataSource.data = data;

      const validCount = data.filter((company) => company.est_valide === 'validée').length;
      const refusedCount = data.filter((company) => company.est_valide === 'refusée').length;
      const ndCount = data.filter((company) => company.est_valide === 'N/D').length;
      this.chartData.datasets[0].data = [validCount, refusedCount, ndCount]; // Update chart data
      if (this.chart) {
        this.chart.update(); // Refresh chart
      }

      // Assign paginator and sort after data is set
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Trigger change detection
      this.cdr.detectChanges();
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
      this.loadCompanies();
    });
  }

  reloadCompanies(): void {
    this.loadCompanies();
    this.newCompaniesCount = 0; // Reset the badge count after reloading
  }

  checkForNewCompanies(): void {
    setInterval(() => {
      this.http.get<any[]>('http://localhost:8000/api/companies/').subscribe((data) => {
        const currentCount = this.dataSource.data.length;
        const newCount = data.length;
        if (newCount > currentCount) {
          this.newCompaniesCount = newCount - currentCount;
        }
      });
    }, 60000); // Check every 60 seconds
  }
}