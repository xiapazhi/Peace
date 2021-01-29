'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Space, Row, Col, Form, DatePicker, Input, Select, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Constans } from '@peace/utils';
import moment from 'moment';
import './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

//通用搜索栏组件  使用方法查看底部propTypes
const Search = (props) => {
    const [expand, setExpand] = useState(false);
    const [form] = Form.useForm();
    //初始化表单数据
    const getinitialValues = () => {
        const { formList } = props;
        let obj = {};
        formList.forEach((v) => {
            const { field, initialValue } = v;
            if (initialValue) {
                obj[field] = initialValue;
            }
        });

        return obj;
    };
    //获取表单项
    const getFields = () => {
        const formItemList = [];
        const { formList, showNumber, offset } = props;
        let showNum = showNumber ? showNumber : 3;
        let customStyle = {
            marginRight: 12,
        }
        if (formList && formList.length > 0) {
            formList.forEach((item, index) => {
                const { noLabel, label, field, type, placeholder, style, labelSpan, showTime, optionName, list, rules, itemProps } = item;
                let style_ = Object.assign({}, style || {}, customStyle)
                switch (type) {
                    case 'TIME':
                        const TIMES = (
                            <FormItem label={label || '选择日期'} name={field} rules={rules} style={{ marginTop: 8 }}>
                                <DatePicker
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    //showTime={showTime ? showTime : false}
                                    style={style_}
                                    placeholder={placeholder || '选择日期'}
                                    format='YYYY-MM-DD'
                                    {...itemProps}
                                />
                            </FormItem>
                        );
                        formItemList.push(TIMES);
                        break;
                    case 'RANGETIME':
                        const RANGETIMES = (
                            <FormItem label={label || '选择日期时间段'} name={field} rules={rules} style={{ marginTop: 8 }}>
                                <RangePicker
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    showTime={showTime ? showTime : false}
                                    style={style_}
                                    //placeholder={placeholder || '选择日期时间段'}
                                    format={showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
                                    {...itemProps}
                                />
                            </FormItem>
                        );
                        formItemList.push(RANGETIMES);
                        break;
                    case 'SELECT':
                        const SELECT = (
                            <FormItem label={label || '请选择'} name={field} rules={rules} style={{ marginTop: 8 }}>
                                <Select
                                    style={style_}
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    placeholder={placeholder || '请选择'}
                                    {...itemProps}
                                >
                                    {getOptionList(list, optionName)}
                                </Select>
                            </FormItem>
                        );
                        formItemList.push(SELECT);
                        break;
                    default:
                        const INPUT = (
                            <FormItem label={noLabel ? '' : (label || '关键字')} name={field} rules={rules} style={{ marginTop: 8 }}>
                                <Input style={style ? style : {}} placeholder={placeholder || '请输入关键字'} {...itemProps} />
                            </FormItem>
                        );
                        formItemList.push(INPUT);
                        break;
                }
            });
        }
        //默认显示个数处理
        return expand ? formItemList : formItemList.slice(0, showNum);
    };

    const onFinish = (values) => {
        const { formList } = props;
        let obj = Object.assign({}, values);
        //处理时间
        formList.forEach((v) => {
            if (v.type == 'TIME' && obj.hasOwnProperty(v.field)) {
                if (obj[v.field]) {
                    obj[v.field] = [
                        moment(obj[v.field]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                        moment(obj[v.field]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                    ];
                }
            }
            if (v.type == 'RANGETIME' && obj.hasOwnProperty(v.field)) {
                if (Array.isArray(obj[v.field])) {
                    obj[v.field] = v.showTime
                        ? [moment(obj[v.field][0]).format('YYYY-MM-DD HH:mm:ss'), moment(obj[v.field][1]).format('YYYY-MM-DD HH:mm:ss')]
                        : [
                            moment(obj[v.field][0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                            moment(obj[v.field][1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                        ];
                }
            }
            //处理undefind
            if (obj[v.field] === undefined) {
                obj[v.field] = null;
            }
        });

        props.onSearch(obj);
    };

    const getOptionList = (data, name) => {
        if (!data) {
            return [];
        }
        return data.map((item) => (
            <Select.Option disabled={item.disabled || false} value={item.value} key={item.key || item.value}>
                {item[`${name}`]}
            </Select.Option>
        ));
    };

    return (
        <Form
            form={form}
            layout='inline'
            name='smart_seal_search'
            className='smart-seal-search-form'
            onFinish={onFinish}
            initialValues={getinitialValues()}
            validateMessages={Constans.defaultValidateMessages}
        >
            {getFields()}
            <Space style={{
                marginTop: 8
            }}>
                <Button htmlType='submit' className='smart-seal-default-btn'>查询</Button>
                {
                    props.showRest && (
                        <Button
                            onClick={() => { form.resetFields(); }}
                            className='smart-seal-default-btn'>
                            重置
                        </Button>
                    )
                }{
                    props.formList.length > props.showNumber && (
                        <a
                            style={{ marginLeft: 8, fontSize: 12 }}
                            onClick={() => { setExpand(!expand); }}>
                            {expand ? <UpOutlined /> : <DownOutlined />} {expand ? '收起' : '展开'}
                        </a>
                    )
                }
            </Space>
        </Form >
    );
};

Search.propTypes = {
    //查询配置数组 [{label, field, type[TIME,RANGETIME,SELECT,INPUT], initialValue, placeholder, width, list(select使用) optionName(select使用) , showTime(是否显示时间),noLabel(不展示label) }]
    formList: PropTypes.array.isRequired,
    showNumber: PropTypes.number, //默认展示几个item ，其余展开按钮控制
    offset: PropTypes.number, //设置第一个item的偏移值
    onSearch: PropTypes.func.isRequired, //查询提交函数
    showRest: PropTypes.bool, //是否显示重置按钮
};

export default Search;
