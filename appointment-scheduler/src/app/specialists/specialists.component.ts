import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

interface Specialist {
  id: number;
  name: string;
  startHour: number;
  endHour: number;
  selected?: boolean;
}

interface ScheduleSlot {
  time: string;
  booked: boolean;
  patient: string;
}

@Component({
  selector: 'app-specialists',
  templateUrl: './specialists.component.html',
  styleUrls: ['./specialists.component.css']
})
export class SpecialistsComponent implements OnInit {
  specialists: Specialist[] = [
    { id: 1, name: "Иванова Н.С.", startHour: 8, endHour: 16 },
    { id: 2, name: "Ароничкова Л.И.", startHour: 9, endHour: 17 },
    { id: 3, name: "Буланова Л.И.", startHour: 10, endHour: 18 },
    { id: 4, name: "Харитонова П.И.", startHour: 8, endHour: 16 },
    { id: 5, name: "Веничит П.И.", startHour: 9, endHour: 17 },
    { id: 6, name: "Степанова Л.А.", startHour: 10, endHour: 18 },
    { id: 7, name: "Рускова П.И.", startHour: 8, endHour: 16 },
    { id: 8, name: "Перепелкина П.И.", startHour: 9, endHour: 17 },
    { id: 9, name: "Петрова М.И.", startHour: 10, endHour: 18 },
    { id: 10, name: "Алентьева В.И.", startHour: 8, endHour: 16 },
    { id: 11, name: "Сидорова П.П.", startHour: 9, endHour: 17 }
  ];
  filteredSpecialists: Specialist[] = [...this.specialists];
  selectedSpecialists: Specialist[] = [];
  schedules: { [date: string]: { [key: number]: ScheduleSlot[] } } = {};
  selectedDate: string = new Date().toISOString().split('T')[0];
  filter: string = '';
  displayDialog: boolean = false;
  appointment: { date: string, time: string, specialist: Specialist, lastName: string, firstName: string, middleName: string } = { 
        date: '', 
        time: '', 
        specialist: {} as Specialist, 
        lastName: '', 
        firstName: '', 
        middleName: '' 
    };

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    console.log('специалисты ngOnInit');
    this.loadSavedSchedules();
  }

  loadSchedules() {
    console.log('loadSchedules method');
    console.log('специалисты:', this.selectedSpecialists);
    this.schedules[this.selectedDate] = this.schedules[this.selectedDate] || {};
    for (let specialist of this.selectedSpecialists) {
      if (!this.schedules[this.selectedDate][specialist.id]) {
        console.log('расписание для', specialist.name);
        this.schedules[this.selectedDate][specialist.id] = this.createSchedule(specialist.startHour, specialist.endHour);
        console.log('составлено расписание для:', specialist.name, this.schedules[this.selectedDate][specialist.id]);
      }
    }
    this.loadSavedAppointments();
    console.log('Расписание после загрузки:', this.schedules);
  }

  createSchedule(startHour: number, endHour: number): ScheduleSlot[] {
    let schedule: ScheduleSlot[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        let time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        schedule.push({ time, booked: false, patient: '' });
      }
    }
    console.log('Сгенерированное расписание:', schedule);
    return schedule;
  }

  getScheduleForSpecialist(specialist: Specialist): ScheduleSlot[] {
    return this.schedules[this.selectedDate]?.[specialist.id] || [];
  }

  onSelectionChange(event: any) {
    this.selectedSpecialists = this.filteredSpecialists.filter(specialist => specialist.selected);
    this.loadSchedules();
  }

  filterSpecialists() {
    this.filteredSpecialists = this.specialists.filter(specialist =>
      specialist.name.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  createAppointment(specialist: Specialist, slot: ScheduleSlot) {
    console.log('createAppointment method', specialist, slot);
    this.appointment = { date: this.selectedDate, time: slot.time, specialist, lastName: '', firstName: '', middleName: '' };
    this.displayDialog = true;
  }

  viewAppointment(slot: ScheduleSlot) {
    console.log('viewAppointment method', slot);
  }

  saveAppointment() {
    console.log('saveAppointment method', this.appointment);
    let schedule = this.schedules[this.appointment.date][this.appointment.specialist!.id];
    let slot = schedule.find(s => s.time === this.appointment.time);
    if (slot) {
        slot.booked = true;
        slot.patient = this.formatPatientName(this.appointment.lastName, this.appointment.firstName, this.appointment.middleName);
        this.saveAppointmentsToLocalStorage();
    }
    this.displayDialog = false;
  }

  cancelAppointment() {
    this.displayDialog = false;
  }

  saveAppointmentsToLocalStorage() {
    localStorage.setItem('schedules', JSON.stringify(this.schedules));
  }

  loadSavedSchedules() {
    let savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      this.schedules = JSON.parse(savedSchedules);
    }
  }

  loadSavedAppointments() {
    let savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      let parsedSchedules = JSON.parse(savedSchedules);
      for (let date of Object.keys(parsedSchedules)) {
        if (!this.schedules[date]) {
          this.schedules[date] = {};
        }
        for (let specialistId of Object.keys(parsedSchedules[date])) {
          let id = Number(specialistId);
          if (!this.schedules[date][id]) {
            this.schedules[date][id] = parsedSchedules[date][id];
          } else {
            for (let i = 0; i < this.schedules[date][id].length; i++) {
              this.schedules[date][id][i].booked = parsedSchedules[date][id][i].booked;
              this.schedules[date][id][i].patient = parsedSchedules[date][id][i].patient;
            }
          }
        }
      }
    }
  }

  formatPatientName(lastName: string, firstName: string, middleName: string): string {
    let firstNameInitial = firstName ? `${firstName.charAt(0)}.` : '';
    let middleNameInitial = middleName ? `${middleName.charAt(0)}.` : '';
    return `${lastName} ${firstNameInitial}${middleNameInitial}`;
  }

  formatDate(dateString: string): string {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
  }

  goToAnalytics(): void {
    let specialistsData = {
      hourlyLoad: this.calculateHourlyLoad(),
      specialistsLoad: this.calculateSpecialistsLoad(),
      monthlyLoad: this.calculateMonthlyLoad()
    };
    this.dataService.setSpecialistsData(specialistsData);
    this.router.navigate(['/charts']);
  }

calculateHourlyLoad() {
  let hourlyLoad = Array(10).fill(0);
  Object.keys(this.schedules).forEach(date => {
    let specialistSchedules = Object.values(this.schedules[date]);
    if (Array.isArray(specialistSchedules)) {
      specialistSchedules.forEach((schedule: ScheduleSlot[]) => {
        if (Array.isArray(schedule)) {
          schedule.forEach(slot => {
            if (slot.booked) {
              let hour = parseInt(slot.time.split(':')[0]) - 8;
              if (hour >= 0 && hour < 10) {
                hourlyLoad[hour]++;
              }
            }
          });
        }
      });
    }
  });
  return hourlyLoad;
}

calculateSpecialistsLoad() {
  let specialistsLoad = Array(this.specialists.length).fill(0);
  this.specialists.forEach((specialist, index) => {
    Object.keys(this.schedules).forEach(date => {
      let schedule = this.schedules[date][specialist.id];
      if (Array.isArray(schedule)) {
        schedule.forEach(slot => {
          if (slot.booked) {
            specialistsLoad[index]++;
          }
        });
      }
    });
  });
  return specialistsLoad;
}

calculateMonthlyLoad() {
  let monthlyLoad = Array(12).fill(0);
  Object.keys(this.schedules).forEach(date => {
    let month = new Date(date).getMonth();
    let specialistSchedules = Object.values(this.schedules[date]);

    if (Array.isArray(specialistSchedules)) {
      specialistSchedules.forEach((schedule: ScheduleSlot[]) => {
        if (Array.isArray(schedule)) {
          schedule.forEach(slot => {
            if (slot.booked) {
              monthlyLoad[month]++;
            }
          });
        }
      });
    }
  });
  return monthlyLoad;
}
}



















