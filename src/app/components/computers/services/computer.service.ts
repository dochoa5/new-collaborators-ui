import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Computer, ComputerAssignment} from '../../../../types/computer';


@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  private apiUrl = 'http://localhost:3000/api/computers';

  constructor(private http: HttpClient) {
  }

  getAvailableComputers(): Observable<Computer[]> {
    return this.http.get<Computer[]>(`${this.apiUrl}/available`);
  }

  assignComputer(data: {
    computer_id: number;
    user_id: number;
    assignment_date: string;
  }): Observable<ComputerAssignment> {
    return this.http.post<ComputerAssignment>(`${this.apiUrl}/assign`, data);
  }

  getAssignmentHistory(): Observable<ComputerAssignment[]> {
    return this.http.get<ComputerAssignment[]>(`${this.apiUrl}/assignments`);
  }

  getAllComputers(): Observable<Computer[]> {
    return this.http.get<Computer[]>(this.apiUrl);
  }
}
