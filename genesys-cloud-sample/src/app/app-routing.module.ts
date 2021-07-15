import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentManagerComponent } from './agent-manager/agent-manager.component';
import { HomeComponent } from './home/home.component';
import { QueueListPageComponent } from './queue-list-page/queue-list-page.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'agentmanager', component: AgentManagerComponent },
  { path: 'user/:id', component: UserDetailsComponent },
  { path: 'queues', component: QueueListPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
