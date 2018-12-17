import * as React from 'react';
import { DetailsList, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import styles from './SharepointCandidates.module.scss';

const _columns: IColumn[] = [
    {
        key: 'Id',
        name: 'Id',
        fieldName: 'Id',
        minWidth: 50,
        maxWidth: 100,
        isResizable:true

    },
    {
        key: 'FirstName',
        name: 'Name',
        fieldName: 'FirstName',
        minWidth: 100,
        maxWidth: 200,
        isResizable:true
    },
    {
        key: 'Title',
        name: 'Surname',
        fieldName: 'Title',
        minWidth: 100,
        maxWidth: 200,
        isResizable:true
    },
    {
        key: 'Email',
        name: 'Email',
        fieldName: 'Email',
        minWidth: 100,
        maxWidth: 200,
        isResizable:true
    },
    {
        key: 'Company',
        name: 'Company',
        fieldName: 'Company',
        minWidth: 100,
        maxWidth: 200,
        isResizable:true
    },
    {
        key: 'Salary',
        name: 'Salary',
        fieldName: 'Salary',
        minWidth: 50,
        maxWidth: 100,
        isResizable:true
    }
];

export const List = (props) => {
    return <DetailsList        
        className={styles.detailsList}
        items={props.contacts}
        columns={_columns}        
        selectionPreservedOnEmptyClick={true}
    />;
};
