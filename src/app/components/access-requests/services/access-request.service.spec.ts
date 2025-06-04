import {TestBed} from '@angular/core/testing';
import {AccessRequestService} from './access-request.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AccessRequest} from '../../../../types/access-request';

describe('AccessRequestService', () => {
  let service: AccessRequestService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/api/access-requests';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccessRequestService]
    });

    service = TestBed.inject(AccessRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an access request', () => {
    const requestPayload = {
      user_id: 1,
      request_type: 'acceso',
      applications: ['Gmail', 'Slack'],
      justification: 'Acceso necesario'
    };

    const mockResponse: AccessRequest = {
      id: 10,
      user_id: 1,
      user_name: 'Juan Pérez',
      request_type: 'acceso',
      applications: ['Gmail', 'Slack'],
      justification: 'Acceso necesario',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    service.createAccessRequest(requestPayload).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestPayload);
    req.flush(mockResponse);
  });

  it('should fetch all access requests', () => {
    const mockData: AccessRequest[] = [
      {
        id: 1,
        user_id: 101,
        user_name: 'María Ruiz',
        request_type: 'acceso',
        applications: ['Slack'],
        justification: 'Requiere acceso',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];

    service.getAllRequests().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should update access request status', () => {
    const id = 5;
    const newStatus: 'approved' = 'approved';

    const mockUpdated: AccessRequest = {
      id,
      user_id: 101,
      user_name: 'Carlos López',
      request_type: 'acceso',
      applications: ['Jira'],
      justification: 'Proyecto urgente',
      status: newStatus,
      created_at: new Date().toISOString()
    };

    service.updateStatus(id, newStatus).subscribe(res => {
      expect(res.status).toBe(newStatus);
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({status: newStatus});
    req.flush(mockUpdated);
  });
});
