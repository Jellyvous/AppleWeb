import { Table } from 'antd';
import React, { useState } from 'react'
import { useMemo } from 'react';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data: dataSource = [], isLoading = false, columns = [], handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const newColumnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== 'action')
        return arr
    }, [columns])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
    };
    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
    }

    return (
        <div>


            {!!rowSelectedKeys.length && (
                <div style={{
                    background: '#db1010',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '10px',
                    cursor: 'pointer',
                    marginRight: '70%',
                    borderRadius: '5px',
                }}
                    onClick={handleDeleteAll}
                >
                    Xóa tất cả
                </div>
            )}

            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </div>
    )
}

export default TableComponent