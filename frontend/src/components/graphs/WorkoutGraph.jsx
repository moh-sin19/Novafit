// Uses code from Apex Charts documentation.
// Includes: https://apexcharts.com/docs/react-charts/
// https://apexcharts.com/docs/chart-types/area-chart/

import Chart from "react-apexcharts";
import { Component } from "react";
import colors from "tailwindcss/colors";
// import

// export default function WorkoutGraph() {
//     return (
//         <Chart
//             options={this.state.options}
//             series={this.state.series}
//             type="line"
//             width="500"
//         />
//     );
// }

class WorkoutGraph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    }
                },
                xaxis: {
                    categories: ["6 Sep", "7 Sep", "8 Sep", "9 Sep", "10 Sep", "11 Sep", "12 Sep", "13 Sep"],
                },
                fill: {
                    colors: ["#7C5590", "#7ECFD9"],
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.8,
                        opacityTo: 0,
                        stops: [0, 70, 100]
                    },
                },
                stroke: {
                    colors: ["#5D3E6C", "#318EA0"],
                    curve: "smooth",
                    width: 2,
                },
                markers: {
                    size: 0,
                },
                dataLabels: {
                    enabled: false,
                },
            },
            // colors: ["#5D3E6C", "#318EA0"],
            series: [
                {
                    name: "Volume",
                    data: [30, 40, 45, 50, 49, 60, 70, 91]
                },
                {
                    name: "Minutes",
                    data: [90, 30, 15, 50, 49, 90, 70, 71]
                }
            ]
        };
    }

    render() {
        return (
            <Chart
                options={this.state.options}
                series={this.state.series}
                colors={colors}
                type="area"
                width="100%"
                height="100%"
                className="z-0"
            />
        );
    }
}

export default WorkoutGraph;