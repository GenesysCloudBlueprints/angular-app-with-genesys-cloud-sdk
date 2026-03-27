import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { GenesysCloudService } from './genesys-cloud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterLink, RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'Yuri\'s Angular App';
  isAuthorized = false;

  constructor(
    private genesysCloudService: GenesysCloudService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.genesysCloudService.isAuthorized.subscribe(isAuthorized => {
      this.isAuthorized = isAuthorized;
    });

    this.route.queryParams.subscribe(params => {
      const language = params['language'];
      const environment = params['environment'];

      this.genesysCloudService.setLanguage(language);
      this.genesysCloudService.setEnvironment(environment);

      this.genesysCloudService.initialize()
        .subscribe(() => {
          console.log('Successfully logged in.');
        });
    });
  }
}
