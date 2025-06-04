import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ComputerService } from '../../services/computer.service';
import { ComputerAssignment, Computer } from '../../../../../types/computer';
import Chart from 'chart.js/auto';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-computer-assignment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './computer-list.component.html',
})
export class ComputerListComponent implements OnInit {
  assignments: ComputerAssignment[] = [];
  allComputers: Computer[] = [];
  isLoading = true;

  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  pieChart: Chart | null = null;

  constructor(private readonly computerService: ComputerService) {}

  ngOnInit(): void {
    this.loadAssignments();
    this.loadComputerStatus();
  }

  loadAssignments(): void {
    this.computerService.getAssignmentHistory().subscribe({
      next: (data) => (this.assignments = data),
      error: (err) => console.error('Error cargando historial:', err),
    });
  }

  loadComputerStatus(): void {
    this.computerService.getAllComputers().subscribe({
      next: (computers) => {
        this.allComputers = computers;
        this.createPieChart();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar computadores:', err);
        this.isLoading = false;
      }
    });
  }

  createPieChart(): void {
    const disponibles = this.allComputers.filter(c => c.status === 'available').length;
    const asignados = this.allComputers.filter(c => c.status === 'assigned').length;

    if (this.pieChart) this.pieChart.destroy();

    this.pieChart = new Chart(this.pieChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Disponibles', 'Asignados'],
        datasets: [{
          data: [disponibles, asignados],
          backgroundColor: ['#4169E1', '#C00000'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  formatDate(date: string | null): string {
    return date ? formatDate(date, 'yyyy-MM-dd HH:mm', 'en-US') : '—';
  }
}
