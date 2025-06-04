import { TestBed } from '@angular/core/testing';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import { App } from './app';
import {Subject} from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      declarations: [
        App
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set isMainPage to true if url is /main or /login', () => {
    const events$ = new Subject<any>();
    const routerMock = { events: events$ } as unknown as Router;

    const app = new App(routerMock);

    events$.next(new NavigationEnd(1, '/main', '/main'));
    expect(app.isMainPage).toBe(true);

    events$.next(new NavigationEnd(1, '/login', '/login'));
    expect(app.isMainPage).toBe(true);

    events$.next(new NavigationEnd(1, '/other', '/other'));
    expect(app.isMainPage).toBe(false);
  });
});
