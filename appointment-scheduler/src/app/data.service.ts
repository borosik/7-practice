import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private specialistsData: any = null;

  setSpecialistsData(data: any) {
    this.specialistsData = data;
  }

  getSpecialistsData() {
    return this.specialistsData;
  }
}

