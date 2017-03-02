import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';

// SERVICES
import { HomeService } from './services/home.service';
import { TeamsService } from './services/teams.service';
import { PlayersService } from './services/players.service';
import { CompetitionsService } from './services/competitions.service';

import { routing } from './configs/nav.config';

// COMPONENTS
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { TeamsComponent } from './components/teams/teams.component';
import { PlayersComponent } from './components/players/players.component';
import { HistoryComponent } from './components/history/history.component';
import { LogoComponent } from './components/common/logoComponent/logo.component';
import { GameTitleComponent } from './components/common/matchTitle.component';
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
    HomeComponent,
    TeamsComponent,
    PlayersComponent,
    HistoryComponent,
    CompetitionsComponent,
    GameTitleComponent,
    CompetitionTableComponent,
    CompetitionGroupComponent,
    Back2TopComponent,
    LogoComponent,

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
    PlayersService,
    CompetitionsService,

    CompetitionsFixturesResolver,
    CompetitionsResolver,
    PlayersResolver,
    TeamsResolver,
    HomeResolver,
    DateFilterPipe,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
