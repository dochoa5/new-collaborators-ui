import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComputerListComponent } from './computer-list.component';
import { ComputerService } from '../../services/computer.service';
import { of, throwError } from 'rxjs';
import { Computer, ComputerAssignment } from '../../../../../types/computer';
import { provideHttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import {ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

describe('ComputerListComponent', () => {
  let component: ComputerListComponent;
  let fixture: ComponentFixture<ComputerListComponent>;
  let mockComputerService: jest.Mocked<ComputerService>;

  const mockAssignments: ComputerAssignment[] = [
    {
      id: 1,
      user_id: 10,
      user_name: 'Laura Torres',
      computer_id: 3,
      computer_name: 'Dell XPS',
      serial_number: 'ABC123',
      assignment_date: '2024-06-01T14:00:00Z',
      status: ''
    }
  ];

  const mockComputers: Computer[] = [
    { id: 1, brand: 'Dell', model: 'XPS', serial_number: 'ABC123', specifications: '16GB RAM', status: 'assigned' },
    { id: 2, brand: 'Lenovo', model: 'ThinkPad', serial_number: 'XYZ789', specifications: '8GB RAM', status: 'available' }
  ];

  beforeEach(async () => {
    mockComputerService = {
      getAssignmentHistory: jest.fn(),
      getAllComputers: jest.fn()
    } as unknown as jest.Mocked<ComputerService>;

    mockComputerService.getAssignmentHistory.mockReturnValue(of(mockAssignments));
    mockComputerService.getAllComputers.mockReturnValue(of(mockComputers));

    await TestBed.configureTestingModule({
      imports: [ComputerListComponent],
      providers: [
        { provide: ComputerService, useValue: mockComputerService },
        { provide: ActivatedRoute, useValue: {} },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComputerListComponent);
    component = fixture.componentInstance;

    component.pieChartCanvas = {
      nativeElement: document.createElement('canvas')
    } as ElementRef<HTMLCanvasElement>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load assignments on init', () => {
    expect(mockComputerService.getAssignmentHistory).toHaveBeenCalled();
    expect(component.assignments).toEqual(mockAssignments);
  });

  it('should load computers and create chart on init', () => {
    expect(mockComputerService.getAllComputers).toHaveBeenCalled();
    expect(component.allComputers).toEqual(mockComputers);
    expect(component.pieChart).toBeInstanceOf(Chart);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error loading assignments', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockComputerService.getAssignmentHistory.mockReturnValueOnce(throwError(() => new Error('Error historial')));
    component.loadAssignments();
    expect(consoleSpy).toHaveBeenCalledWith('Error cargando historial:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should handle error loading computers', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockComputerService.getAllComputers.mockReturnValueOnce(throwError(() => new Error('Error computadores')));
    component.loadComputerStatus();
    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar computadores:', expect.any(Error));
    expect(component.isLoading).toBe(false);
    consoleSpy.mockRestore();
  });

  it('should format date correctly', () => {
    const result = component.formatDate('2025-06-02T10:15:00Z');
    expect(result).toMatch(/^2025-06-02 0?\d:15$/);
  });

  it('should return placeholder when date is null', () => {
    expect(component.formatDate(null)).toBe('—');
  });

  it('should destroy existing chart before creating a new one', () => {
    const destroySpy = jest.fn();
    component.pieChart = { destroy: destroySpy } as unknown as Chart;
    component.pieChartCanvas = {
      nativeElement: document.createElement('canvas')
    } as ElementRef<HTMLCanvasElement>;

    component.allComputers = mockComputers;
    component.createPieChart();

    expect(destroySpy).toHaveBeenCalled();
    expect(component.pieChart).toBeInstanceOf(Chart);
  });
});
