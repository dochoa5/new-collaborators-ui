export interface Computer {
  id: number;
  brand: string;
  model: string;
  serial_number: string;
  specifications: string;
  status: string;
  assigned_user_id?: number;
  assigned_user_name?: string;
  assignment_date?: string;
}

export interface ComputerAssignment {
  id: number;
  computer_id: number;
  computer_name: string;
  serial_number: string;
  user_id: number;
  user_name: string;
  assignment_date: string;
  return_date?: string;
  status: string;
}
