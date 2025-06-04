import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComputerService } from './computer.service';
import { Computer, ComputerAssignment } from '../../../../types/computer';

describe('ComputerService', () => {
  let service: ComputerService;
  let httpMock: HttpTestingController;

  const mockComputers: Computer[] = [
    {
      id: 1, serial_number: 'ABC123', model: 'Dell', status: 'available',
      brand: '',
      specifications: ''
    },
    {
      id: 2, serial_number: 'XYZ789', model: 'HP', status: 'assigned',
      brand: '',
      specifications: ''
    }
  ];

  const mockAssignments: ComputerAssignment[] = [
    {
      id: 1,
      user_id: 100,
      user_name: 'Laura Martínez',
      computer_id: 1,
      serial_number: "ABC123",
      assignment_date: '2024-06-01T10:00:00Z',
      computer_name: '',
      status: ''
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComputerService]
    });

    service = TestBed.inject(ComputerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch available computers', () => {
    service.getAvailableComputers().subscribe(res => {
      expect(res).toEqual([mockComputers[0]]);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/computers/available');
    expect(req.request.method).toBe('GET');
    req.flush([mockComputers[0]]);
  });

  it('should assign a computer', () => {
    const data = { computer_id: 1, user_id: 100, assignment_date: '2024-06-01' };

    service.assignComputer(data).subscribe(res => {
      expect(res).toEqual(mockAssignments[0]);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/computers/assign');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush(mockAssignments[0]);
  });

  it('should get assignment history', () => {
    service.getAssignmentHistory().subscribe(res => {
      expect(res).toEqual(mockAssignments);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/computers/assignments');
    expect(req.request.method).toBe('GET');
    req.flush(mockAssignments);
  });

  it('should get all computers', () => {
    service.getAllComputers().subscribe(res => {
      expect(res).toEqual(mockComputers);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/computers');
    expect(req.request.method).toBe('GET');
    req.flush(mockComputers);
  });
});
