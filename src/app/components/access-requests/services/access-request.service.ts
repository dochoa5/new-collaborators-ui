import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessRequest } from '../../../../types/access-request';

@Injectable({
  providedIn: 'root'
})
export class AccessRequestService {
  private readonly apiUrl = 'http://localhost:3000/api/access-requests';

  constructor(private readonly http: HttpClient) {}

  createAccessRequest(request: {
    user_id: number;
    request_type: any;
    applications: any;
    justification: any
  }): Observable<AccessRequest> {
    return this.http.post<AccessRequest>(this.apiUrl, request);
  }

  getAllRequests(): Observable<AccessRequest[]> {
    return this.http.get<AccessRequest[]>(this.apiUrl);
  }

  updateStatus(id: number, status: 'approved' | 'rejected'): Observable<AccessRequest> {
    return this.http.put<AccessRequest>(`${this.apiUrl}/${id}/status`, { status });
  }
}
