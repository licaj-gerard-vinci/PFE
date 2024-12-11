import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
import { Router } from '@angular/router';
import { IncompleteFormDialogComponent } from '../incomplete-form-dialog/incomplete-form-dialog.component';

Chart.register(...registerables);

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
    IncompleteFormDialogComponent
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

  chartLabels: string[] = ['Valides', 'Refusée', 'N/D'];
  chartData: ChartData<'pie', number[], string> = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Company Status',
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
        display: false,
        labels: {
          usePointStyle: false, 
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  constructor(private http: HttpClient, public dialog: MatDialog, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.checkForNewCompanies();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  goToFormulaire(company: any): void {
    if (!company.est_termine) {
      this.dialog.open(IncompleteFormDialogComponent, {
        width: '400px',
      });
    } else {
      this.router.navigate(['/formulaire'], { queryParams: { id: company.id_client } });
    }
  }

  loadCompanies(): void {
    this.http.get<any[]>('http://localhost:8000/api/companies/').subscribe((data) => {
      this.dataSource.data = data;

      const validCount = data.filter((company) => company.est_valide === 'validée').length;
      const refusedCount = data.filter((company) => company.est_valide === 'refusée').length;
      const ndCount = data.filter((company) => company.est_valide === 'N/D').length;
      this.chartData.datasets[0].data = [validCount, refusedCount, ndCount];
      if (this.chart) {
        this.chart.update();
      }

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

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
    this.newCompaniesCount = 0;
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
    }, 30000); // Check every 60 seconds
  }
}