import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from './genesys-cloud.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Yuri\'s Angular App';
  isAuthorized = false;

  constructor(
    private genesysCloudService : GenesysCloudService,
    private route: ActivatedRoute,
  ){ }

  ngOnInit(){
    console.log(this.route.snapshot)
    this.genesysCloudService.isAuthorized.subscribe(isAuthorized => {
      this.isAuthorized = isAuthorized;
    });

    // Get query parameters for 'environment' and 'language'
    this.route.queryParams.subscribe(params => {
      const language = params['language'];
      const environment = params['environment'];

      this.genesysCloudService.setLanguage(language);
      this.genesysCloudService.setEnvironment(environment);

      this.genesysCloudService.initialize()
        .subscribe(() => { 
          console.log('Succesfully logged in.')
        });
    });    
  }
}
