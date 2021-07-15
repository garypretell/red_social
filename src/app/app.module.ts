import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MomentModule } from 'ngx-moment';
import { AppHeaderComponent } from './app-header/app-header.component';
import { TooltipDirective } from './shared/directive/tooltip.directive';
import { SafePipe } from './shared/pipes/safe.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CookieService } from 'ngx-cookie-service';
import { JwtModule } from '@auth0/angular-jwt';
import { TagInputModule } from 'ngx-chips';
import { AuthInterceptorService } from './shared/authInterceptor';
import { ClipboardModule } from 'ngx-clipboard';


export function tokenGetter(): any {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    TooltipDirective,
    SafePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MomentModule,
    InfiniteScrollModule,
    ClipboardModule,
    JwtModule.forRoot({
      config: {
        tokenGetter
      },
    }),
    TagInputModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
