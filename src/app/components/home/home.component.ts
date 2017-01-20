import { Competitions } from '../competitions/competitions.component';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { InlineArray } from '@angular/core/src/linker/view_utils';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';

import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: Http, private homeService: HomeService) {
    this.route.data
      .takeWhile(() => !this.allCompetitions.length || !this.homeData.fixtures.length)
      .subscribe(val => {
        this.homeData = val['home'].json();

       this.sortFixtures();

        this.allCompetitions = val['competitions'].json();

        this.allCompetitions.forEach(competition => {
          this.vocablurary[competition.id] = competition.caption;
        })

      });
  }

  lastCompetitions: number[] = [];
  allCompetitions: any[] = [];
  homeData = { fixtures: [] };
  vocablurary: Object = {};
  competitions: any[] = [];
  table: any[] = [];
  filter = 'date';


  ngOnInit() {
    let lastIds = this.getLastCompetitions();
    //console.log('l', lastIds, this.competitions);

    this.competitions = this.allCompetitions.filter(cmp => {
      //console.log('cmp', cmp.id, lastIds.includes(cmp.id));
      return !lastIds.includes(cmp.id);
    });

    this.lastCompetitions = this.allCompetitions.filter(cmp => lastIds.includes(cmp.id));

  }

  isNewCompetition(match, i) {
    const prev = this.homeData.fixtures[i - 1];

    return i === 0 || (prev && match._links.competition.id !== prev._links.competition.id)
  }

  getHistory(match) {

  }

  getLastCompetitions(): any {
    let list: any = localStorage.getItem('lastCompetitions');
    list = JSON.parse(list);

    return list && list.length ? list : [];
  }

  isCheched(val) {
    return this.filter === val;
  }

  onSortChange(val) {
    this.filter = val;
    this.sortFixtures();
  }
  
  sortFixtures(){
    if(this.filter === 'league'){
      this.homeData.fixtures = this.homeData.fixtures.sort((prev, curr) => prev._links.competition.id - curr._links.competition.id);
    } else if(this.filter === 'date'){
      this.homeData.fixtures = this.homeData.fixtures.sort((prev, curr) => {
        let date1 = new Date(prev.date);
        let date2 = new Date(curr.date);
        return date1.getTime() - date2.getTime();
      });
    }
    
  }
}
