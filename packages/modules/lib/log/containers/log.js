
'use strict';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, } from 'antd';
import { getLogInfo } from '../actions/index';
import LogSearch from '../components/logSearch';
import moment from 'moment';

const Log = (props) => {
    const { dispatch, user, logs, isRequesting } = props
    const [currentPage, setCurrentPage] = useState(1)

    const getLogs = (params) => {
        dispatch(getLogInfo(user.id, params))
    }

    useEffect(() => {
        getLogs({
            keywords: '',
            startTime: moment().add(-1, 'month',),
            endTime: moment()
        })
    }, [])

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <LogSearch onSearch={getLogs} />
            </div>
            <Table
                dataSource={logs}
                rowKey={record => record.index}
                columns={[{
                    title: '日期',
                    key: 'logTime',
                    width: '12%',
                    dataIndex: 'logTime'
                }, {
                    title: '客户端类型',
                    key: 'clientType',
                    width: '12%',
                    dataIndex: 'clientType'
                }, {
                    title: '内容',
                    key: 'content',
                    width: '20%',
                    dataIndex: 'content',
                    render: (text, record) => (text || "无")
                },
                {
                    title: '操作参数',
                    width: '56%',
                    key: 'parameter',
                    dataIndex: 'parameter',
                    render: (text, record) => (text || "无")
                }]}
                pagination={{
                    current: currentPage,
                    total: logs.length,
                    showSizeChanger: true,
                    onChange: page => {
                        setCurrentPage(page)
                    }
                }}
                loading={isRequesting}
            />
        </div>
    )
}

function mapStateToProps(state) {
    const { log, auth } = state;
    return {
        logs: log.data || [],
        user: auth.user,
        isRequesting: log.isRequesting
    };
}

export default connect(mapStateToProps)(Log);