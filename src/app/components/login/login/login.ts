import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  form: FormGroup;
  error = '';

  private readonly hardcodedUsername = 'admin';
  private readonly hardcodedPassword = '1234';

  constructor(private readonly fb: FormBuilder, private readonly router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    const { username, password } = this.form.value;
    if (
      username === this.hardcodedUsername &&
      password === this.hardcodedPassword
    ) {
      localStorage.setItem('auth', 'true');
      this.router.navigate(['/main']);
    } else {
      this.error = 'Credenciales inválidas';
    }
  }
}
