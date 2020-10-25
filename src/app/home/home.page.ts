import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  validations_form: FormGroup;
  cuenta: FormGroup;
  validation_messages = {
    'DNI': [
      { type: 'validDNI', message: 'La letra no corresponde con los números' },
      { type: 'required', message: 'DNI es requerido' },
      { type: 'minlength', message: 'DNI debe tener 9 caracteres' },
      { type: 'maxlength', message: 'DNI debe tener 9 caracteres' },
      { type: 'pattern', message: 'DNI debe tener el patrón correspondiente' },
    ],
    'IBAN': [
      { type: 'required', message: 'IBAN es requerido' },
      { type: 'minlength', message: 'IBAN debe tener 24 caracteres' },
      { type: 'maxlength', message: 'IBAN debe tener 24 caracteres' },
      { type: 'pattern', message: 'Introduce un IBAN válido' }
    ],
    'cuenta': [
      { type: 'validIBAN', message: 'El DNI no tiene asociado este IBAN' }
    ],
  };



  constructor(
    public formBuilder: FormBuilder,
    private navCtrl: NavController
  ) { }

  ngOnInit() {


    this.cuenta = new FormGroup({
      DNI: new FormControl('', Validators.compose([
        this.validDNI,
        Validators.maxLength(9),
        Validators.minLength(9),
        Validators.pattern('[0-9]{8,8}[A-Za-z]'),
        Validators.required
      ])),
      IBAN: new FormControl('', Validators.compose([
        Validators.maxLength(24),
        Validators.minLength(24),
        Validators.pattern('ES[0-9]{22}'),
        Validators.required,
      ]))
    }, (formGroup: FormGroup) => {
      return this.validIBAN(formGroup);
    });

    this.validations_form = this.formBuilder.group({
      cuenta: this.cuenta,
    });
  }

  onSubmit(values) {
    console.log(values);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        user: JSON.stringify(values),
        numero: 3
      }
    };
    this.navCtrl.navigateForward('/user', navigationExtras);
  }



  validDNI(fc: FormControl) {
    var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    var numeros = fc.value.substring(0, fc.value.length - 1);
    var numero = numeros % 23;
    var letraCorr = letras.charAt(numero);
    var letra = fc.value.substring(8, 9);
    if (letraCorr != letra) {
      return ({ validDNI: true });
    } else {
      return (null);
    }
  }

  validIBAN(fg: FormGroup) {
    var cuen = { 'DNI': '77925974L', 'IBAN': 'ES1111111111111111111111' }
    var iban = fg.controls['IBAN'].value
    var dni = fg.controls['DNI'].value
    if (iban != cuen.IBAN || dni != cuen.DNI) {
      return ({ validIBAN: true });
    } else {
      return (null);
    }
  }

}//end_class