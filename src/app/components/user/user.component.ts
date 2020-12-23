import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'user',
    templateUrl: './user.component.html'
})

export class UserComponent implements OnInit{

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(param => console.log(param));
    }

}