import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage implements OnInit {
  forgetForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgetForm.invalid) {
      return;
    }

    // Handle the form submission here
    const email = this.forgetForm.controls['email'].value;
    console.log(email); // Replace with your own logic
  }

  isEmailInvalidAndRequired(): boolean {
    const emailControl = this.forgetForm.controls['email'];
    return emailControl.invalid && emailControl.errors?.['required'];
  }
}
