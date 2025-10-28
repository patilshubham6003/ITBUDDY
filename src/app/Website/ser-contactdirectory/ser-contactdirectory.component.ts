import { Component, OnInit } from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
	selector: 'app-ser-contactdirectory',
	templateUrl: './ser-contactdirectory.component.html',
	styleUrls: ['./ser-contactdirectory.component.css']
})
export class SerContactdirectoryComponent implements OnInit {
	TITLE: any;
	contact: any = [];
	loaded = false;
	contactdirecto: any = [];
	loadserv: any;

	constructor(private apiservice: WebsiteService) { }
	ngOnInit(): void {
		this.loadserv = localStorage.getItem('serviceid');
		this.getContactdirectory();
		window.scroll({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	}
	videocount: any = [];

	getContactdirectory() {
		this.apiservice.getcontactdirectory(0, 0, 'id', 'desc', ' AND STATUS=1 AND SERVICE_ID=' + this.loadserv).subscribe(data => {
			this.contactdirecto = data['data'];
			this.videocount = data['count'];
		});
	}
}