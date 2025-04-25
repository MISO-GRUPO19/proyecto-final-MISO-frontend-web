import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { I18nModule } from '../i18n.module';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-barra-superior',
  standalone: true,
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    I18nModule,
    ReactiveFormsModule
  ]
})
export class BarraSuperiorComponent{

  searchForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ){
    this.searchForm = this.fb.group({
      value: [''],
      type: ['barcode']
    });
  }

  onSubmit() {
    const { value, type } = this.searchForm.value;
    if (!value) return;

    this.router.navigate(['product-search'], {
      queryParams: { value, type }
    });
  }
}
