import React from 'react';
import { createStyles, WithStyles, withStyles, Paper } from '@material-ui/core';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';


//copied from https://codesandbox.io/s/2hp3y
//https://devexpress.github.io/devextreme-reactive/react/chart/demos/bar/simple-bar/
import { Animation } from '@devexpress/dx-react-chart';

const styles = () =>
    createStyles({
        wrapper: {
            height: '100%',
            width: '100%',
            overflow: 'auto',
        }
    });
export interface IProps extends WithStyles<typeof styles> {
}

const data = [
    { year: '1950', population: 2.525 },
    { year: '1960', population: 3.018 },
    { year: '1970', population: 3.682 },
    { year: '1980', population: 4.440 },
    { year: '1990', population: 5.310 },
    { year: '2000', population: 6.127 },
    { year: '2010', population: 6.930 },
];



class Analytics extends React.Component<IProps, {data: any}>{

    constructor(props: IProps) {
        super(props);
        this.state = {
            data,
        };
    }

    getGraph(){
        const { data: chartData } = this.state;
        return (
            <Paper>
                <Chart
                    data={chartData}
                >
                    <ArgumentAxis />
                    <ValueAxis />

                    <BarSeries
                        valueField="population"
                        argumentField="year"
                    />
                    <Title text="World population" />
                    <Animation />
                </Chart>
            </Paper>
        );
    }

    render() {
        return (
            <div className={this.props.classes.wrapper}>
                <h1>In process of designing this page</h1>
                <p>Will involve some graphs</p>
                {this.getGraph()}
            </div>
        );
    }
}

export default withStyles(styles)(Analytics);