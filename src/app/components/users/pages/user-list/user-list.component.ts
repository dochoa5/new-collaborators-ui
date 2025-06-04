import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { UserService } from '../../services/user.service';
import {FormsModule} from '@angular/forms';
import {User} from '../../../../../types/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  imports: [CommonModule, FormsModule, RouterLink]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(private readonly userService: UserService, private readonly router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoading = false;
      }
    });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  onEdit(userId: number | string | undefined): void {
    if (userId !== undefined) {
      this.router.navigate(['/users/edit', String(userId)]);
    }
  }
  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
