// Angular
import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MyPageComponent } from './my-page/my-page.component';
import {MatListModule, MatSelectModule} from '@angular/material';
import {DataTableService} from '../../core/_base/layout';

@NgModule({
	declarations: [MyPageComponent],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		NgbModule,
		CoreModule,
		PartialsModule,
		MatSelectModule,
		MatListModule
	],
	providers: [DatePipe]
})
export class PagesModule {
}
