import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../services/formation.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(private formationService: FormationService) { }

  formations: any[] = [];

  ngOnInit(): void {
    this.fetchFormations();
  }
  
  fetchFormations() {
    this.formationService.getFormations().subscribe(
      (data) => {
        this.formations = data;
        console.log('Formations:', this.formations); // Vérification dans la console
      },
      (error) => {
        console.error('Erreur lors de la récupération des formations:', error);
      }
    );
  }
  deleteFormation(id: string) {
    this.formationService.deleteFormation(id).subscribe(
      () => {
        console.log('Formation deleted successfully');
        // Réactualiser la liste des formations après la suppression
        this.fetchFormations();
      },
      error => {
        console.error('Error deleting formation:', error);
      }
    );
  }
}
