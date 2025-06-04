export interface AccessRequest {
  id: number;
  user_id: number;
  user_name: string;
  request_type: string;
  applications: string[];
  justification: string;
  status: string;
  created_at?: string;
}
