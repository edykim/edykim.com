---
title: Angular의 의존성 주입 이해하기 – @Inject, @Injectable, 토큰과 프로바이더
author: haruair
type: post
date: 2017-08-18T11:50:14+00:00
history:
  - 
    from: https://www.haruair.com/blog/3991
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: understanding-angular-dependency-injection-inject-injectable-tokens-and-providers
categories:
  - 개발 이야기
  - 번역
tags:
  - angularjs
  - js
  - dependency injection
  - di
  - typescript

---
[Todd Motto][1]의 글 [Mastering Angular dependency injection with @Inject, @Injectable, tokens and providers][2]를 번역했다. Angular 내에서 의존성 처리를 위해 어떤 과정을 거치는지 내부적인 구조를 이해하는데 도움이 되었다.

* * *

## Angular의 의존성 주입 이해하기 &#8211; @Inject, @Injectable, 토큰과 프로바이더

Angular의 프로바이더는 애플리케이션을 개발하는데 있어 핵심적이며 의존성을 주입할 수 있는 다양한 방식을 제공한다. 이 포스트는 `@Inject()`와 `@Injectable()` 데코레이터 뒤에서 일어나는 일을 살펴보고 사용하는 방법을 확인하려고 한다. 그런 후에 토큰과 프로바이더를 이해하고 Angular가 실제로 어떻게 의존성을 찾고 생성하는지 살펴본다. 또한 Ahead-of-Time 소스 코드도 설명할 것이다.

### 프로바이더 주입하기

Angular는 의존성 주입(DI)를 사용할 때 수많은 마법 같은 일이 일어난다. Angular 1.x에서는 문자열 토큰을 사용해서 세세한 의존성을 처리하는 간단한 접근 방식을 사용했다. 이 방법은 이미 알고 있을 것이다.

```js
function SomeController($scope) {
  // $scope를 사용한다
}
SomeController.$inject = ['$scope'];
```

DI 어노테이션 처리에 대해 더 자세히 알고 싶다면 [예전 포스트][3]를 참고하자.

좋은 접근 방식이지만 한계점이 있었다. 애플리케이션을 만들 때는 다양한 모듈을 만드는 것이 자연스러운 과정이다. 필요에 따라서 기능 모듈이나 라이브러리처럼 외부 모듈을 불러오기도 한다. (예를 들면 `ui-router`) 다른 모듈이라 하더라도 컨트롤러/서비스 등 동일한 이름을 사용할 수 없고 만약 동일한 이름이 있다면 컴파일 차례에서 충돌이 발생하게 될 것이다. (의존성이 같은 명칭을 갖고 있다면 서로를 덮어 쓰려고 하기 때문에 충돌이 발생한다.)

다행스럽게도 Angular의 새로운 의존성 주입은 완전히 새로 작성했으며 더 강력하고 유연한 방식으로 의존성 주입을 처리한다.

#### 새로운 의존성 주입 방식

서비스(프로바이더)를 컴포넌트/서비스에 주입하려고 한다면 필요로 하는 프로바이더를 생성자에 _타입 정의_로 작성할 수 있다.

```js
import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'example-component',
  template: '<div>I am a component</div>'
})
class ExampleComponent {
  constructor(private http: Http) {
    // `this.http` 로 Http 프로바이더에 접근 가능.
  }
}
```

여기서 사용한 타입 정의는 `Http` (H가 대문자)며 Angular는 자동으로 마법같이 이 서비스를 `http`에 배정했다.

여기까지만 봐도 상당히 마법같이 동작하는 것을 알 수 있다. 타입 정의는 타입스크립트에서만 사용할 수 있는 기능이다. 이론적으로는 컴파일된 자바스크립트 코드가 브라우저에서 실행되기 전까지는 `http`가 실제로 어떤 파라미터인지 알 방법이 없다.

`tsconfig.json` 파일을 살펴보면 `emitDecoratorMetadata` 값이 `true`로 설정되어 있다. 타입 파라미터를 컴파일된 자바스크립트 출력물에서 데코레이터로 사용할 수 있도록 메타데이터를 같이 내보내게 된다.

실제로 컴파일된 코드는 어떤 식인지 살펴본다. (읽기 편하도록 ES6의 모듈 불러오는 코드는 그대로 두었다.)

```js
import { Component } from '@angular/core';
import { Http } from '@angular/http';

var ExampleComponent = (function () {
  function ExampleComponent(http) {
    this.http = http;
  }
  return ExampleComponent;
}());
ExampleComponent = __decorate([
  Component({
    selector: 'example-component',
    template: '<div>I am a component</div>'
  }),
  __metadata('design:paramtypes', [Http])
], ExampleComponent);
```

컴파일된 코드를 보면 `@angular/http`로 제공된 `Http` 서비스가 `http`와 동일하다는 점을 이해하고 있다. 데코레이터로 클래스에 다음처럼 메타데이터를 추가하게 된다.

```js
__metadata('design:paramtypes', [Http])
```

기본적으로 `@Component` 데코레이터는 일반 ES5로 변경되었고 추가적인 `metadata`가 제공되며 `__decorate`를 통해 배정되고 있다는 점을 확인할 수 있다. 이런 과정으로 Angular는 `Http` 토큰을 확인한 후 컴포넌트 `constructor`의 첫 인자로 전달하고 `this.http`에 배정하게 된다.

```js
function ExampleComponent(http) {
  this.http = http;
}
```

이 동작 방식은 `$inject`의 방식과 비슷하다. 하지만 _문자열_로 처리되던 토큰이 _클래스_ 형태로 다뤄진다는 점에서 다르다. 명명에 의한 충돌이 없고 더 강력하다.

> 아마도 &#8220;토큰&#8221;에 대한 컨셉을 들은 적이 있을 것이다. (또는 `OpaqueToken`) Angular는 이 접근 방법으로 프로바이더를 저장하고 사용한다. 사용하려는 프로바이더를 참조할 때 토큰을 열쇠로 사용하는 것이다. (위 코드에서는 불러온 `Http`가 프로바이더다.) 하지만 기존 키와는 다르게 개체, 클래스, 문자열 등 어떤 것이든 올 수 있다는 점에서 다르다. 

#### @Inject()

`@Inject()`는 어디서 사용할 수 있을까? 컴포넌트를 앞서 작성한 방식과는 다르게 다음처럼 작성할 수 있다.

```js
import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'example-component',
  template: '<div>I am a component</div>'
})
class ExampleComponent {
  constructor(@Inject(Http) private http) {
    // 여기서 `this.http`를 Http 프로바이더로 사용할 수 있음
  }
}
```

이 코드에서 `@Inject`는 해당 토큰을 직접 찾아 배정하는 방법이다. 소문자 `http` 인자 뒤에 타입을 작성하는 방법과는 반대로 말이다.

이 방식은 컴포넌트나 서비스가 많은 의존성을 필요로 할 때 엉망이 될 수 있다. (그리고 엉망이 될 것이다.) Angular에서는 메타데이터를 추가해 의존성을 해결할 수 있기 때문에 대부분의 경우는 `@Inject`가 필요하지 않다.

[OpaqueToken][4]를 사용하는 경우가 유일하게 `@Inject`를 사용해야 하는 상황이다. 이 경우에는 의존성 주입 프로바이더에서 접근하기 위해 비어 있는 고유 토큰으로 사용할 수 있다.

`@Inject`를 이 경우에 사용해야 하는 이유는 `OpaqueToken`을 파라미터의 _타입_으로 사용할 수 없기 때문이다. 다음처럼 작성하게 되면 동작하지 않을 것이다.

```js
const myToken = new OpaqueToken('myValue');

@Component(...)
class ExampleComponent {
  constructor(private token: myToken) {}
}
```

`myToken`은 타입이 아닌 값이다. 즉, 이 경우에는 타입스크립트가 컴파일을 할 수 없다. 하지만 `OpaqueToken`과 함께 사용할 수 있는 `@Inject`는 다음처럼 유용하게 사용할 수 있다.

```js
const myToken = new OpaqueToken('myValue');

@Component(...)
class ExampleComponent {
  constructor(@Inject(myToken) private token) {
    // `token` 프로바이더를 사용할 수 있음
  }
}
```

여기서 `OpaqueToken`을 더 깊이 다루지는 않는다. 하지만 주입할 토큰을 수동 처리할 때 필요한 `@Inject`를 어떻게 사용할 수 있는지 살펴봤다. 어떤 것이든 이제 토큰으로 사용할 수 있을 것이다. 다시 말하면 타입스크립트에서 정의한 &#8220;타입&#8221;으로 제한하지 않고 사용한다는 뜻이다.

#### @Injectable()

`@Injectable()`은 컴포넌트나 서비스에 의존성 주입을 위해 필수적인 데코레이터라는 점은 흔하게 나타나는 잘못된 믿음이다. 실제로는 [현재 이슈][5]가 있어서 `@Injectable()`을 필수로 사용하는 것이지 이 사실은 _아마도_ 변경될 예정이다. (이 변경은 상당히 최신이라 한동안 반영되지 않을 수도 있고 아예 반영되지 않을 수도 있다.)

Angular 데코레이터를 사용하면 꾸며진 클래스(decorated class)를 Angular가 읽을 수 있는 양식의 메타데이터로 보관하게 된다. 이 메타데이터에는 의존성을 어떻게 찾고 주입하는지에 대한 정보가 들어있다.

하지만 Angular 데코레이터를 사용하더라도 Angular가 어떤 방법으로도 필요한 의존성 정보를 찾을 수 없는 클래스가 있다고 생각해보자. 이런 경우에 `@Injectable()`을 사용해야 한다.

서비스에서 프로바이더를 주입한다면 반드시 `@Injectable()`을 사용해야 한다. 프로바이더는 추가적인 기능이 없기 때문에 Angular에 필요한 메타데이터가 저장될 수 있도록 지정해야 한다.

즉, 서비스를 다음처럼 작성했다고 가정하자.

```js
export class UserService {
  isAuthenticated(): boolean {
    return true;
  }
}
```

예로 든 컴포넌트는 어떤 프로바이더도 주입하지 않고 있기 때문에 데코레이터를 사용할 필요가 없다.

하지만 서비스가 의존성(`Http`)을 포함하고 있다면 다음처럼 작성하게 된다.

```js
import { Http } from '@angular/http';

export class UserService {
  constructor(private http: Http) {}
  isAuthenticated(): Observable<boolean> {
    return this.http.get('/api/user').map((res) => res.json());
  }
}
```

이 코드는 `Http` 프로바이더의 메타데이터가 저장되지 않아서 Angular가 제대로 의존성을 해결하지 못할 것이다.

이런 문제는 간단히 `@Injectable()`로 풀 수 있다.

```js
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class UserService {
  constructor(private http: Http) {}
  isAuthenticated(): Observable<boolean> {
    return this.http.get('/api/user').map((res) => res.json());
  }
}
```

이제 Angular는 `Http` 토큰을 인식하고 `http`에 무엇을 주입해야 하는지 알게 되었다.

### 토큰과 의존성 주입

이제 _어떻게_ Angular가 주입하는지 알았으니 어떻게 의존성을 해결하고 인스턴스로 바꾸는지 배울 수 있다.

#### 프로바이더 등록하기

`NgModule` 내에 어떻게 전형적인 서비스를 등록하는지 살펴보자.

```js
import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';

@NgModule({
  providers: [
    AuthService
  ]
})
class ExampleModule {}
```

위 코드는 짧은 문법으로 풀어서 작성하면 다음과 같다.

```js
import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';

@NgModule({
  providers: [
    {
      provide: AuthService,
      useClass: AuthService
    }
  ]
})
class ExampleModule {}
```

개체 내 `provide` 프로퍼티는 등록할 프로바이더를 위한 토큰이다. Angular가 `AuthService` 토큰에 어떤 내용이 있는지 `useClass` 값을 사용해서 살펴본다는 뜻이다.

이 방식은 장점이 여러가지 있다. 먼저 동일한 `class`명인 프로바이더가 있더라도 Angular에서 올바른 서비스를 참조하는데 전혀 문제가 없다. 둘째로 _토큰_이 동일하다면 기존에 존재하는 프로바이더를 다른 프로바이더로 덮어 쓸 수 있다는 점이다.

#### 프로바이더 덮어쓰기

`AuthService`를 다음처럼 작성했다고 가정하자.

```js
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class AuthService {

  constructor(private http: Http) {}

  authenticateUser(username: string, password: string): Observable<boolean> {
    // returns true or false
    return this.http.post('/api/auth', { username, password });
  }

  getUsername(): Observable<string> {
    return this.http.post('/api/user');
  }

}
```

이 서비스를 애플리케이션 전체에 사용하고 있다고 상상해보자. 사용자가 로그인 하기 위한 양식도 만들었다.

```js
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'auth-login',
  template: `
    <button (click)="login()">
      Login
    </button>
  `
})
export class LoginComponent {

  constructor(private authService: AuthService) {}

  login() {
    this.authService
      .authenticateUser('toddmotto', 'straightouttacompton')
      .subscribe((status: boolean) => {
        // 사용자가 로그인 후 해야 할 내용 작성
      });
  }

}
```

이제 사용자명을 표시하기 위해 사용자 정보를 서비스에서 가져와 사용할 수 있다.

```js
@Component({
  selector: 'user-info',
  template: `
    <div>
      You are {% raw %}{{ username }}{% endraw %}!
    </div>
  `
})
class UserInfoComponent implements OnInit {

  username: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService
      .getUsername()
      .subscribe((username: string) => this.username = username);
  }

}
```

이 내용을 `AuthModule`라는 이름 아래에 모듈로 묶을 수 있다.

```js
import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';

import { LoginComponent } from './login.component';
import { UserInfoComponent } from './user-info.component';

@NgModule({
  declarations: [
    LoginComponent,
    UserInfoComponent
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule {}
```

각각의 컴포넌트를 다 뒤져서 새 프로바이더를 참조하도록 변경해야 한다. 토큰을 사용했다면 직접 다 수정하는 대신에 `AuthService` 토큰에 `FacebookAuthService`을 대신 사용하도록 얹는 것이 가능하다.

```js
import { NgModule } from '@angular/core';

// totally made up
import { FacebookAuthService } from '@facebook/angular';

import { AuthService } from './auth.service';

import { LoginComponent } from './login.component';
import { UserInfoComponent } from './user-info.component';

@NgModule({
  declarations: [
    LoginComponent,
    UserInfoComponent
  ],
  providers: [
    {
      provide: AuthService,
      useClass: FacebookAuthService
    }
  ]
})
export class AuthModule {}
```

위 프로바이더 설정을 보면 단순히 `useClass` 프로퍼티에 다른 값으로 바꾼 것을 볼 수 있다. 이 방법으로 어플리케이션 내에서 `AuthService`를 사용하는 곳이라면 변경된 프로바이더가 적용된다.

이런 이유로 Angular에 프로바이더를 찾기 위한 용도에서 `AuthService`를 토큰으로 사용한다. 새로운 클래스인 `FacebookAuthService`로 교체한 대로 모든 컴포넌트는 이 클래스를 사용하게 될 것이다.

### 인젝터(injector) 이해하기

여기까지 읽었다면 토큰과 Angular의 의존성 주입 시스템을 이해했을 것이다. 다음 장에서는 더 상세하게 이해하기 위해 Angular에서 컴파일된 [AoT][6] 코드 안을 들여다 보려고 한다.

#### 사전 컴파일된 코드

컴파일된 코드를 살펴보기 전에 사전 컴파일된 버전의 코드를 보려고 한다. 사전 컴파일은 무엇일까? 그 코드는 Ahead-of-Time 컴파일 이전에 우리가 작성한 코드다. 기본적으로 우리가 작성한 모든 코드는 사전 컴파일에 해당하며 Angular는 [JiT][7]을 사용해 브라우저에서 컴파일을 하는 것이 가능하다. 또는 더 효과적인 접근 방식으로 오프라인에서 컴파일(AoT)을 수행할 수 있다.

이제 어플리케이션을 다 만들었다고 생각하고 아래 `NgModule` 코드를 확인해보자.

```js
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

export const ROUTER_CONFIG: Routes = [
  { path: '', loadChildren: './home/home.module#HomeModule' },
  { path: 'about', loadChildren: './about/about.module#AboutModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactModule' }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(ROUTER_CONFIG),
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent
  ]
})
export class AppModule {}
```

이 코드는 상당히 익숙하다. 루트 컴포넌트와 다른 모듈로 연결하는 몇 라우트가 포함되었다. 이 코드를 Angular가 _컴파일_ 한다면 _실제_ 코드는 어떤 모양일까?

Angular는 VM (가상 머신) 친화적 코드를 생성해서 가능한 한 성능 좋은 코드를 만들어 낸다. 환상적인 일이다. 컴파일된 코드를 열어보고 조금 더 상세하게 알아보자.

#### AppModuleInjector

Angular는 각 모듈을 위한 인젝터(주입자, injector)를 생성한다. 위 코드에서는 `AppModule` (데코레이트된 코드)를 사용해서 `AppModuleInjector`라는 이름의 인젝터를 생성한다.

생성된 `AppModuleInjector`를 확인해보자.

```js
import { NgModuleInjector } from '@angular/core/src/linker/ng_module_factory';
import { CommonModule } from '@angular/common/src/common_module';
import { ApplicationModule, _localeFactory } from '@angular/core/src/application_module';
import { BrowserModule, errorHandler } from '@angular/platform-browser/src/browser';
import { RouterModule, ROUTER_FORROOT_GUARD } from '@angular/router/src/router_module';
import { NgLocaleLocalization, NgLocalization } from '@angular/common/src/localization';
import { ApplicationInitStatus, APP_INITIALIZER } from '@angular/core/src/application_init';
import { Testability, TestabilityRegistry } from '@angular/core/src/testability/testability';
import { HttpModule } from '@angular/http/src/http_module';
import { ApplicationRef, ApplicationRef_ } from '@angular/core/src/application_ref';
import { BrowserModule } from '@angular/platform-browser/src/browser';
import { Injector } from '@angular/core/src/di/injector';
import { LOCALE_ID } from '@angular/core/src/i18n/tokens';
import { RouterModule, provideForRootGuard } from '@angular/router/src/router_module';
import { Router } from '@angular/router/src/router';
import { NgZone } from '@angular/core/src/zone/ng_zone';
import { Console } from '@angular/core/src/console';
import { ROUTES } from '@angular/router/src/router_config_loader';
import { ErrorHandler } from '@angular/core/src/error_handler';

import { AppModule } from './app.module';
import { AppComponentNgFactory } from './app.component.ngfactory';

class AppModuleInjector extends NgModuleInjector<AppModule> {
  _CommonModule_0: CommonModule;
  _ApplicationModule_1: ApplicationModule;
  _BrowserModule_2: BrowserModule;
  _ROUTER_FORROOT_GUARD_3: any;
  _RouterModule_4: RouterModule;
  _HttpModule_5: HttpModule;
  _AppModule_6: AppModule;
  _ErrorHandler_7: any;
  _ApplicationInitStatus_8: ApplicationInitStatus;
  _Testability_9: Testability;
  _ApplicationRef__10: ApplicationRef_;
  __ApplicationRef_11: any;
  __ROUTES_12: any[];

  constructor(parent: Injector) {
    super(parent, [AppComponentNgFactory], [AppComponentNgFactory]);  
  }

  get _ApplicationRef_11(): any {
    if (this.__ApplicationRef_11 == null) { 
      this.__ApplicationRef_11 = this._ApplicationRef__10; 
    }
    return this.__ApplicationRef_11;
  }

  get _ROUTES_12(): any[] {
    if (this.__ROUTES_12 == null) { 
      this.__ROUTES_12 = [[
        {
          path: '', loadChildren: './home/home.module#HomeModule'
        },
        {
          path: 'about', loadChildren: './about/about.module#AboutModule'
        },
        {
          path: 'contact', loadChildren: './contact/contact.module#ContactModule'
        }
      ]]; 
    }
    return this.__ROUTES_12;
  }

  createInternal(): AppModule {
    this._CommonModule_0 = new CommonModule();
    this._ApplicationModule_1 = new ApplicationModule();
    this._BrowserModule_2 = new BrowserModule(this.parent.get(BrowserModule, (null as any)));
    this._ROUTER_FORROOT_GUARD_3 = provideForRootGuard(this.parent.get(Router, (null as any)));
    this._RouterModule_4 = new RouterModule(this._ROUTER_FORROOT_GUARD_3);
    this._HttpModule_5 = new HttpModule();
    this._AppModule_6 = new AppModule();
    this._ErrorHandler_7 = errorHandler();
    this._ApplicationInitStatus_8 = new ApplicationInitStatus(this.parent.get(APP_INITIALIZER, (null as any)));
    this._Testability_9 = new Testability(this.parent.get(NgZone));

    this._ApplicationRef__10 = new ApplicationRef_(
      this.parent.get(NgZone), 
      this.parent.get(Console), 
      this, 
      this._ErrorHandler_7, 
      this,
      this._ApplicationInitStatus_8,
      this.parent.get(TestabilityRegistry, (null as any)),
      this._Testability_9
    );
    return this._AppModule_6;
  }

  getInternal(token: any, notFoundResult: any): any {
    if (token === CommonModule) { return this._CommonModule_0; }
    if (token === ApplicationModule) { return this._ApplicationModule_1; }
    if (token === BrowserModule) { return this._BrowserModule_2; }
    if (token === ROUTER_FORROOT_GUARD) { return this._ROUTER_FORROOT_GUARD_3; }
    if (token === RouterModule) { return this._RouterModule_4; }
    if (token === HttpModule) { return this._HttpModule_5; }
    if (token === AppModule) { return this._AppModule_6; }
    if (token === ErrorHandler) { return this._ErrorHandler_7; }
    if (token === ApplicationInitStatus) { return this._ApplicationInitStatus_8; }
    if (token === Testability) { return this._Testability_9; }
    if (token === ApplicationRef_) { return this._ApplicationRef__10; }
    if (token === ApplicationRef) { return this._ApplicationRef_11; }
    if (token === ROUTES) { return this._ROUTES_12; }

    return notFoundResult;
  }

  destroyInternal(): void {
    this._ApplicationRef__10.ngOnDestroy();
  }
}
```

> 코드가 좀 이상하게 보일지 모르지만 (그리고 실제로 생성된 코드는 더 이상하게 보일 것이다) 이 코드에서 무슨 일이 실제로 일어나는지 확인하자. 

_실제_ 생성된 코드를 좀 더 읽기 쉽도록 불러오는(import) 부분을 고쳤다. 각 모듈에서는 와일드카드를 사용해서 동일 이름으로 충돌하는 일이 없도록 처리되어 있다.

`HttpModule`을 불러오는 부분을 보면 알 수 있을 것이다.

```js
import * as import6 from '@angular/http/src/http_module';
```

이런 접근 방식으로 `HttpModule`을 직접 참조하는 대신 `import6.HttpModule`로 사용할 수 있다.

이 생성된 코드에서 살펴봐야 하는 부분은 세 가지다. 클래스에 있는 프로퍼티, 모듈이 어떻게 불려오는지, 그리고 의존성 주입 원리가 어떻게 동작하는지에 대해서다.

#### AppModuleInjector 프로퍼티

각 프로바이더와 의존성을 처리하기 위해서 `AppModuleInjector`프로퍼티가 생성되었다.

```js
// ...
class AppModuleInjector extends NgModuleInjector<AppModule> {
  _CommonModule_0: CommonModule;
  _ApplicationModule_1: ApplicationModule;
  _BrowserModule_2: BrowserModule;
  // ...
}
```

위 코드는 컴파일된 출력의 일부다. 이 클래스에 선언된 세 가지 프로퍼티를 확인해보자.

  * CommonModule
  * ApplicationModule
  * BrowserModule

작성한 모듈에서는 `BrowserModule`만 사용했는데 `CommonModule`과 `ApplicationModule`은 어디서 온 것일까? 이 정보는 `BrowserModule`에 _의해_ 추가된 부분으로 이 모듈을 사용하기 위해 직접 불러올 필요가 없도록 컴파일에 포함되었다.

또한 모듈의 모든 프로퍼티 끝에는 숫자가 붙어 있다. 와일드카드로 모듈을 불러온 것처럼 각 프로바이더 사이에서 나타날 수 있는 명칭으로 인한 잠재적 충돌을 피하기 위한 방법이다.

두 모듈이 동일한 이름의 서비스를 사용한다면 위 설명처럼 숫자를 붙이지 않고서는 같은 이름의 프로퍼티에 저장되어 잠재적인 오류의 원인이 될 것이다.

#### 모듈 불러오기

컴파일을 수행하면 Angular는 각 프로바이더를 불러올 때 직접적인 경로를 사용하기 때문에 코드를 작성할 때는 다음처럼 작성해도 된다.

```js
import { CommonModule } from '@angular/common';
```

AoT 컴파일된 버전은 다음과 같다.

```js
import * as import5 from '@angular/common/src/common_module';
```

코드가 컴파일되고 번들로 묶이면 [나무 흔들기][8]를 할 수 있다는 장점이 있고 각 모듈에서 실제로 사용되는 부분만 포함하는 것이 가능하다.

#### 의존성 주입

각 모듈은 각자의 의존성 주입을 처리하는데 만약 의존성을 찾지 못한다면 찾을 때까지 부모 모듈을 타고 올라간다. 계층을 다 탐색해도 찾지 못하면 그때 오류가 발생한다.

모든 의존성은 토큰을 통해 유일함을 확인하는데 이 접근 방식은 의존성을 등록할 때와 찾을 때 모두 사용된다.

의존성을 주입하는 방법은 `createInternal`를 사용하는 방법과 프로퍼티의 게터(getter)를 사용하는 방법 두 가지가 있다.

> 불려오는 모듈이나 밖으로 보내는 모듈은 `createInternal`과 함께 생성된다. 이 부분은 모듈이 인스턴스로 만들어지는 순간에 실행된다. 

다음은 `BrowserModule`과 `HttpModule`을 사용하는 경우다. 모듈을 사용하면 다음같은 코드가 생성된다.

```js
class AppModuleInjector extends NgModuleInjector<AppModule> {
  _CommonModule_0: CommonModule;
  _ApplicationModule_1: ApplicationModule;
  _BrowserModule_2: BrowserModule;
  _HttpModule_5: HttpModule;
  _AppModule_6: AppModule;

  createInternal(): AppModule {
    this._CommonModule_0 = new CommonModule();
    this._ApplicationModule_1 = new ApplicationModule();
    this._BrowserModule_2 = new BrowserModule(this.parent.get(BrowserModule, (null as any)));
    this._HttpModule_5 = new HttpModule();
    this._AppModule_6 = new AppModule();
    // ...
    return this._AppModule_6;
  }
}
```

`BrowserModule`에는 두 외부 모듈인 `CommonModule`과 `ApplicationModule`이 생성되었고 불러온 모듈도 만들어졌다. 또한 실제 모듈인 `AppModule`도 생성되어 다른 모듈에서도 사용 가능하다.

다른 모든 프로바이더를 위해서는 생성을 한 후에 필요에 따라 클래스의 게터로 주입한다.

> 언제든 Angular에서 인젝터를 듣는다면 이 인젝터는 모듈에서 생성된 (컴파일된) 코드를 참조한다는 뜻이다. 

Angular가 의존성을 확인할 때(예를 들면 `constructor`를 통해 주입할 때) 모듈 인젝터 속을 보고 찾고 찾지 못했다면 부모 모듈을 추적해서 계속 검색한다. 그래도 존재하지 않는다면 오류가 발생한다.

`constructor`에 타입 정의를 사용하면 Angular는 이 타입(여기서는 클래스)을 토큰으로 사용해 의존성을 찾는다. 그런 후에 이 토큰은 `getInternal`로 전달되는데 의존성이 존재한다면 해당 의존성의 인스턴스를 반환하게 된다. 소스 코드를 확인하자.

```js
class AppModuleInjector extends NgModuleInjector<AppModule> {

  // new BrowserModule(this.parent.get(BrowserModule, (null as any)));
  _BrowserModule_2: BrowserModule;

  // new HttpModule()
  _HttpModule_5: HttpModule;

  // new AppModule()
  _AppModule_6: AppModule;

  getInternal(token: any, notFoundResult: any): any {
    if (token === BrowserModule) { return this._BrowserModule_2; }
    if (token === HttpModule) { return this._HttpModule_5; }
    if (token === AppModule) { return this._AppModule_6; }

    return notFoundResult;
  }
}
```

`getInternal` 메소드 안을 보면 Angular가 토큰을 단순한 `if` 문을 사용해서 확인하는 것을 볼 수 있다. 맞는 의존성을 찾는다면 프로바이더를 위해 연관된 프로퍼티를 반환하게 된다.

반면 `notFoundResult`를 반환하면 `getInternal` 메소드는 사용하지 않는다. Angular에서 필요한 의존성을 찾는 동안에 `notFoundResult`는 `null`이 된다. 최상위 모듈까지 훑어도 의존성을 찾지 못했다면 오류가 발생한다.

### 정리하며

이 글이 `@Inject`와 `@Injectable`, 토큰과 프로바이더, 그리고 Angular가 AoT 컴파일을 통해 VM 친화적인 코드를 생성하는지에 대해 더 깊이 이해하는데 도움이 되었으면 좋겠다.

 [1]: https://twitter.com/toddmotto
 [2]: https://toddmotto.com/angular-dependency-injection
 [3]: https://toddmotto.com/angular-js-dependency-injection-annotation-process/
 [4]: https://angular.io/docs/ts/latest/api/core/index/OpaqueToken-class.html
 [5]: https://github.com/angular/angular/issues/13820
 [6]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
 [7]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html#!#aot-jit
 [8]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html#!#tree-shaking