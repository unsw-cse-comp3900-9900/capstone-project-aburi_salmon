import React from 'react';
import { createStyles, WithStyles, withStyles, Paper, Theme, TableContainer,  TableHead, TableRow, Button, Table, TableBody, TableCell } from '@material-ui/core';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
    Tooltip,
} from '@devexpress/dx-react-chart-material-ui';


//copied from https://codesandbox.io/s/2hp3y
//https://devexpress.github.io/devextreme-reactive/react/chart/demos/bar/simple-bar/
import { Animation, EventTracker } from '@devexpress/dx-react-chart';

const styles = (theme: Theme) =>
    createStyles({
        table: {
            minWidth: 300,
        },
        wrapper: {
            height: '100%',
            width: '100%',
            overflow: 'auto',
        },
        graph: {
            height: '85%',
        }
    });
export interface IProps extends WithStyles<typeof styles> {
}

const data = [
    { year: 'Sunday', population: 1020 },
    { year: 'Monday', population: 702 },
    { year: 'Tuesday', population: 1325 },
    { year: 'Wednesday', population: 500 },
    { year: 'Thursday', population: 1203 },
    { year: 'Friday', population: 820 },
    { year: 'Saturday', population: 794 },
];


class Analytics extends React.Component<IProps, {data: any}>{

    constructor(props: IProps) {
        super(props);
        this.state = {
            data,
        };
    }
    getGraph(){
        return (
            <Paper>
                <Chart
                    data={data}
                    height={600}
                >
                    <ArgumentAxis />
                    <ValueAxis />

                    <BarSeries
                        valueField="population"
                        argumentField="year"
                    />
                    <Title
                        text="Earnings (last 7 days)"
                    />
                    <EventTracker />
                    <Tooltip />
                </Chart>
            </Paper>
        );
    }
    render() {
        return (
            <div className={this.props.classes.wrapper}>
               
                {this.getGraph()}
            </div>
        );
    }
}

export default withStyles(styles)(Analytics);