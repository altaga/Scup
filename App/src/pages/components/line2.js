
import React from 'react';
import { Line } from 'react-chartjs-2';

var options = "";

class LineGraph2 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    options = {
      legend: {
        display: false,
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            max: this.props.max,
            min: this.props.min
          }
        }]
      },
      responsive: true,
      animation: {
        duration: 0
      }
    }
    var data = {
      labels: this.props.data[1],

      datasets: [
        {
          label: 'ECG',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(255,0,0,0.4)',
          borderColor: 'rgba(255,0,0,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(255,0,0,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(255,0,0,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.props.data[0],
        }
      ]
    };
    return (
      <Line options={options} height={window.innerHeight / 4 - 20} data={data} redraw />
    );
  }
}

export default LineGraph2;