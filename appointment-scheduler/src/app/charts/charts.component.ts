import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { DataService } from '../data.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  hourlyLoadChartOptions: EChartsOption = {};
  specialistsLoadChartOptions: EChartsOption = {};
  monthlyLoadChartOptions: EChartsOption = {};

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.initCharts();
  }

initCharts(): void {
  console.log("Initializing charts...");
  const data = this.dataService.getSpecialistsData();
  console.log("Data for charts:", data);
  if (data) {
    const specialistNames = [
      'Иванова Н.С.', 'Ароничкова Л.И.', 'Буланова Л.И.', 'Харитонова П.И.', 'Веничит П.И.',
      'Степанова Л.А.', 'Рускова П.И.', 'Перепелкина П.И.', 'Петрова М.И.', 'Алентьева В.И.', 'Сидорова П.П.'
    ];

    this.hourlyLoadChartOptions = {
      title: {
        text: 'Загруженность времени'
      },
      xAxis: {
        type: 'category',
        data: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data.hourlyLoad,
          type: 'bar'
        }
      ]
    };

    this.specialistsLoadChartOptions = {
      title: {
        text: 'Загруженность специалистов'
      },
      xAxis: {
        type: 'category',
        data: specialistNames, 
        axisLabel: {
          interval: 0,
          rotate: 30,
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data.specialistsLoad,
          type: 'bar'
        }
      ]
    };

    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    this.monthlyLoadChartOptions = {
      title: {
        text: 'Загруженность по месяцам'
      },
      xAxis: {
        type: 'category',
        data: monthNames
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data.monthlyLoad,
          type: 'line'
        }
      ]
    };
  }
}


  goBack(): void {
    this.router.navigate(['/specialists']);
  }
}

