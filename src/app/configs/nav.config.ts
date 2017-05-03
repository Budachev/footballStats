import { HistoryComponent } from '../components/history/history.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { CompetitionsComponent } from '../components/competitions/competitions.component';
import { TeamsComponent } from '../components/teams/teams.component';
import { PlayersComponent } from '../components/players/players.component';

import { CompetitionsResolver, CompetitionsFixturesResolver } from '../resolvers/competitions.resolver';
import { TeamsResolver } from '../resolvers/teams.resolver';
import { PlayersResolver } from '../resolvers/players.resolver';
import { HomeResolver } from '../resolvers/home.resolver';

const APP_ROUTES: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        resolve: {
            home: HomeResolver,
            competitions: CompetitionsResolver
        }
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'competitions/:id',
        component: CompetitionsComponent,
         resolve: {
            competition: CompetitionsResolver,
            fixtures: CompetitionsFixturesResolver
        }
    },
    {
        path: 'history/:id',
        component: HistoryComponent
    },
    {
        path: 'players/:id',
        component: PlayersComponent,
         resolve: {
            players: PlayersResolver
        }
    },
    {
        path: 'teams/:id',
        component: TeamsComponent,
         resolve: {
            team: TeamsResolver
        }
    },
    { path: 'record', loadChildren: 'app/modules/record/record.module#RecordModule' },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
