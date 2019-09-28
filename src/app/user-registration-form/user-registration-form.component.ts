import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.css']
})
export class UserRegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fBuilder: FormBuilder) { }

  ngOnInit() {
    this.registrationForm = this.fBuilder.group(
      {
        firstName: ['PK', Validators.required],
        lastName: ['Jacob', Validators.required],
        email: [
          'email@xyz.com',
          Validators.compose([Validators.required, Validators.email, domain('xyz.com')])
        ],
        confirmEmail: [
          'email@xyz.com',
          Validators.compose([Validators.required, Validators.email])
        ],
        acceptLicense: [true, Validators.requiredTrue],
        dateOfBirth: ['']
      }, { validators: shouldMatch('email', 'confirmEmail') }
    )
  }

  ctrl(ctrlName) {
    return this.registrationForm.get(ctrlName);
  }

  emailErrors(confirmEmail = false) {
    const emailCtrl = confirmEmail ? this.ctrl('confirmEmail') : this.ctrl('email');
    console.log(emailCtrl.errors);
    if (emailCtrl.errors.required) {
      return 'Email is required.';
    }
    if (emailCtrl.errors.email) {
      return 'Invalid email address.';
    }
    if (emailCtrl.errors.domain) {
      return 'Invalid email domain.';
    }
    if (emailCtrl.errors.doNotMatch) {
      return 'Confirm email do not match.';
    }
  }
}

function domain(domainName): ValidatorFn {
  return control => {
    if (control.value.endsWith(domainName)) {
      return null;
    }
    return { domain: 'invalid' }
  }
}

function shouldMatch(ctrl1Name, ctrl2Name): ValidatorFn {
  return fControl => {
    const ctrl1 = fControl.get(ctrl1Name);
    const ctrl2 = fControl.get(ctrl2Name);
    if (ctrl1.value === ctrl2.value) {
      return null;
    }
    ctrl2.setErrors({ doNotMatch: true });
  }
}