import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SeederService } from './seeder/seeder.service';

@Injectable()
export class AppBootstrapService implements OnApplicationBootstrap {
  constructor(private readonly seederService: SeederService) {}

  /**
   * Cette méthode est automatiquement appelée une fois que l'application est initialisée
   * et que tous les modules sont chargés
   */
  async onApplicationBootstrap() {
    await this.seederService.seed();
  }
} 