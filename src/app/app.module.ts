import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

// SERVICES
import { HomeService } from './services/home.service';
import { TeamsService } from './services/teams.service';
import { PlayersService } from './services/players.service';
import { CompetitionsService } from './services/competitions.service';
import { LoginService } from './services/login.service';

import { routing } from './configs/nav.config';

// COMPONENTS
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { TeamsComponent } from './components/teams/teams.component';
import { LoginComponent } from './components/login/login.component';
import { PlayersComponent } from './components/players/players.component';
import { HistoryComponent } from './components/history/history.component';
import { RegisterComponent } from './components/register/register.component';
import { GameTitleComponent } from './components/common/matchTitle.component';
import { LogoComponent } from './components/common/logoComponent/logo.component';
import { Back2TopComponent } from './components/common/back2top/back2top.component';
import { CompetitionsComponent } from './components/competitions/competitions.component';
import { CompetitionGroupComponent } from './components/common/competitionGroup.component';
import { CompetitionTableComponent } from './components/common/competitionTable.component';

// DIRECTIVES

// PIPES
import { appDatePipe } from './pipes/appDate.pipe';
import { DateFilterPipe } from './pipes/dateFilter.pipe';

// RESOLVERS
import { HomeResolver } from './resolvers/home.resolver';
import { TeamsResolver } from './resolvers/teams.resolver';
import { PlayersResolver } from './resolvers/players.resolver';
import { CompetitionsResolver, CompetitionsFixturesResolver } from './resolvers/competitions.resolver';

// Bootstrap
import { PopoverModule } from 'ng2-bootstrap/popover';
import { DatepickerModule } from 'ng2-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LogoComponent,
    HomeComponent,
    LoginComponent,
    TeamsComponent,
    PlayersComponent,
    HistoryComponent,
    Back2TopComponent,
    RegisterComponent,
    GameTitleComponent,
    CompetitionsComponent,
    CompetitionTableComponent,
    CompetitionGroupComponent,

    // Pipes
    appDatePipe,
    DateFilterPipe
  ],
  imports: [
    PopoverModule.forRoot(),
    DatepickerModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    HomeService,
    TeamsService,
    LoginService,
    PlayersService,
    CompetitionsService,

    CompetitionsFixturesResolver,
    CompetitionsResolver,
    PlayersResolver,
    DateFilterPipe,
    TeamsResolver,
    HomeResolver,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
