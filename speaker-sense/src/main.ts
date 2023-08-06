import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Storage } from 'aws-amplify';

Storage.configure({
  aws_project_region: 'us-east-2', 
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
