'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table as AntdTable, Divider, Dropdown, Menu, Spin, Popconfirm } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { fromJS } from 'immutable';
import './index.less';

const loop = (data, keypath, values) => {
    // deal with array
    let dkey = keypath.slice(0, 1)[0];
    if (dkey) {
        let dvalue = data[dkey];
        let otherKeypath = keypath.slice(1);
        if (Array.isArray(dvalue)) {
            if (otherKeypath.length) {
                let immutableData = fromJS(data);
                for (let index = 0; index < dvalue.length; index++) {
                    let tmp = immutableData.getIn([dkey, index]).toJS();
                    loop(tmp, otherKeypath, values);
                }
            }
        } else {
            values.push(dvalue);
        }
    }
    return values;
};

//通用table组件 使用方法查看底部propTypes
class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            pagination: {
                showTotal: (total) => `共${total}条`,
                showSizeChanger: true,
                showQuickJumper: true,
                responsive: true,
                pageSizeOptions: ['10', '20', '30', '40'],
                defaultPageSize: 10
            },
            visible: {},
            current: 1
        };
        this.token = JSON.parse(sessionStorage.getItem('user')).token;
    }
    handleMenuClick = (e) => {
        //TODO 点击删除
    };

    UNSAFE_componentWillReceiveProps() {
        this.setState({
            visible: {}
        });
    }

    handleVisibleChange = (flag, key) => {
        let visible = this.state.visible;
        visible[key] = flag;
        this.setState({ visible });
    };

    getColumns = () => {
        let columns = this.props.attrs.map((attr) => {
            const { dataIndex, key, name, render, width, ellipsis } = attr;
            let obj = {
                title: name,
                dataIndex: dataIndex || key,
                key: key,
                ellipsis: ellipsis == undefined ? true : ellipsis,
                width: width
            };
            if (render) {
                obj.render = render;
            }
            return obj;
        });

        if (!this.props.actions) {
            return columns;
        }

        columns.push({
            title: '操作',
            key: 'action',
            className: 'fs-table-column-action',
            render: (text, record) => {
                let actions = this.props.actions;
                if (record && record.actions) actions = actions.filter((act) => record.actions.includes(act.key));

                return (
                    <span style={{ whiteSpace: 'normal' }}>
                        {actions.reduce((p, c, i) => {
                            const { key, name, handler, dom, style, dropdown, hidden, popconfirm, getPopTitleFun, definedTitle } = c;
                            if (typeof hidden === 'function') {
                                let unVisiable = hidden(record);
                                if (unVisiable) return p;
                            }

                            if (dropdown && Array.isArray(dropdown)) {
                                // 操作按钮 下拉菜单处理
                                const menus = (
                                    <Menu onClick={this.handleMenuClick}>
                                        {dropdown.map((m) => {
                                            if (m.popconfirm) {
                                                return (
                                                    <Menu.Item key={m.key}>
                                                        <Popconfirm
                                                            placement='left'
                                                            title={m.title ? m.title : `确认${m.name}？`}
                                                            onConfirm={() => {
                                                                m.handler && m.handler(record);
                                                            }}
                                                        >
                                                            <a onClick={(e) => e.preventDefault()}>{m.name}</a>
                                                        </Popconfirm>
                                                    </Menu.Item>
                                                );
                                            } else {
                                                return (
                                                    <Menu.Item key={m.key}>
                                                        <a onClick={(e) => m.handler && m.handler(record)}>{m.name}</a>
                                                    </Menu.Item>
                                                );
                                            }
                                        })}
                                    </Menu>
                                );
                                p.push(
                                    <Dropdown
                                        overlay={menus}
                                        onVisibleChange={(e) => this.handleVisibleChange(e, text.id)}
                                        visible={this.state.visible ? this.state.visible[text.id] : false}
                                        key={key}
                                    >
                                        <a style={style ? style : { display: 'inline-block' }} onClick={(e) => e.preventDefault()}>
                                            {name} <DownOutlined />
                                        </a>
                                    </Dropdown>
                                );
                            } else {
                                if (dom) {
                                    popconfirm
                                        ? p.push(
                                            <Popconfirm placement='left' title={`确认${name}吗？`} onConfirm={() => handler(record)} key={key}>
                                                <span
                                                    style={style ? style : { display: 'inline-block' }}
                                                    key={key}
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    {dom}
                                                </span>
                                            </Popconfirm>
                                        )
                                        : p.push(
                                            <span style={style ? style : { display: 'inline-block' }} key={key} onClick={(e) => handler(record)}>
                                                {dom}
                                            </span>
                                        );
                                } else {
                                    popconfirm
                                        ? p.push(
                                            <Popconfirm placement='left' title={definedTitle && getPopTitleFun ? getPopTitleFun(record) : `确认${name}吗？`} onConfirm={() => handler(record)} key={key}>
                                                <a
                                                    style={style ? style : { display: 'inline-block' }}
                                                    key={key}
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    {name}
                                                </a>
                                            </Popconfirm>
                                        )
                                        : p.push(
                                            <a style={style ? style : { display: 'inline-block' }} key={key} onClick={(e) => handler(record)}>
                                                {name}
                                            </a>
                                        );
                                }
                            }

                            if (i < actions.length - 1) p.push(<Divider key={`divider${i}`} type='vertical' />);
                            return p;
                        }, [])}
                    </span>
                );
            }
        });

        return columns;
    };

    getColumnData = (opts) => {
        const { data, keypath, spliter, rawdata } = opts;
        let v = null;
        let outer = data[keypath[0]];
        if (Array.isArray(outer)) {
            let values = loop(data, keypath, []);
            v = rawdata ? values : values.join(spliter || '，');
        } else {
            v = fromJS(data).getIn(keypath);
        }
        return v;
    };

    getPagination = () => {
        const { total, curpage } = this.props;
        const { pagination, current } = this.state;
        pagination.total = total ? total : 0;
        pagination.current = curpage ? curpage : current;
        return pagination;
    };
    //暂时只支持分页远程处理
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            current: pagination.current
        });
        let limit = Number.parseInt(pagination.pageSize);
        let offset = limit * (Number.parseInt(pagination.current) - 1);
        this.props.onTableChange(limit, offset, pagination.current);
    };
    render() {
        const { scroll, rowSelection, data, isRequesting, showHeader, noShowPagination, rowKey } = this.props;
        return (
            <AntdTable
                className={'fs-table'}
                id='fs-smart-seal-table'
                dataSource={data}
                loading={isRequesting}
                showHeader={showHeader}
                scroll={scroll ? scroll : {}}
                rowKey={rowKey ? rowKey : 'id'}
                rowSelection={rowSelection ? rowSelection : null}
                columns={this.getColumns()}
                onChange={this.handleTableChange}
                pagination={noShowPagination ? false : this.getPagination()}
            />
        );
    }
}
Table.propTypes = {
    data: PropTypes.array.isRequired, //数据资源
    attrs: PropTypes.array.isRequired, //属性数组用于colums {key,name,|render|isImg|nullable}
    actions: PropTypes.array, //操作栏数组  { key,name,style,handler,dropdown,dom}
    scroll: PropTypes.object, //同antd 用法
    rowSelection: PropTypes.object, //表格行是否可选择 配置项同antd
    onTableChange: PropTypes.func, //onChange触发函数
    showHeader: PropTypes.bool, //是否显示表头
    noShowPagination: PropTypes.bool, //是否显示分页器,
    showLessItems: PropTypes.bool, //是否显示较少页面内容,
    rowKey: PropTypes.string//表格记录的key
};
export default Table;
