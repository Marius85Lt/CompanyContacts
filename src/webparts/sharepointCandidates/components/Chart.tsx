import * as React from 'react';
import { Pie } from 'react-chartjs';
import { IContactList } from '../../../services/service.interface';

export const Chart = (props) => {
  const chartData = props.contacts && props.contacts.map((item:IContactList) => ({
    value:item.Salary,
    labal:item.Salary
  })); 
 
  return <Pie data={chartData} width="150" height="150" />;
};
