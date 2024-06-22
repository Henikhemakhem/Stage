import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../../services/formation.service';

@Component({
  selector: 'app-ajoutformation',
  templateUrl: './ajoutformation.component.html',
  styleUrls: ['./ajoutformation.component.css']
})
export class AjoutformationComponent implements OnInit {
  form!: FormGroup; // Assurez-vous que form est déclaré sans initialisation pour éviter le type 'null'
  isEditing = false;
  idcourant!: string;
  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private formationService: FormationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idcourant = this.route.snapshot.params['id'];
    this.initForm();

    if (this.idcourant) {
      this.isEditing = true;
      this.formationService.getFormationbyId(this.idcourant).subscribe(
        (formation) => {
          this.form.patchValue(formation);
        },
        (error) => {
          console.error('Erreur lors de la récupération de la formation :', error);
        }
      );
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      duration: ['', Validators.required],
      level: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.form.get('image')?.setValue(this.selectedFile); // Utilisation de l'opérateur de navigation sécurisé (?.)
    }
  }

  onSubmit(): void {
    if (this.form && this.form.valid) { // Vérification que form est défini et valide
      const formData = new FormData();
      formData.append('title', this.form.get('title')?.value); // Utilisation de l'opérateur de navigation sécurisé (?.)
      formData.append('description', this.form.get('description')?.value);
      formData.append('category', this.form.get('category')?.value);
      formData.append('duration', this.form.get('duration')?.value);
      formData.append('level', this.form.get('level')?.value);
      formData.append('image', this.selectedFile);

      if (this.isEditing) {
        this.formationService.updateFormation(this.idcourant, formData).subscribe(
          () => {
            console.log('Formation mise à jour avec succès.');
            this.router.navigate(['/formation']);
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de la formation :', error);
          }
        );
      } else {
        this.formationService.createFormation(formData).subscribe(
          () => {
            console.log('Formation ajoutée avec succès.');
            this.router.navigate(['/formation']);
          },
          (error) => {
            console.error('Erreur lors de l\'ajout de la formation :', error);
          }
        );
      }
    } else {
      console.error('Le formulaire n\'est pas valide.');
    }
  }
}
