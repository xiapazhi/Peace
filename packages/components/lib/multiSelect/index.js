/**
 * Created by PengPeng on 2016/12/22.
 * Refactored by Liuxinyi on 2017/9/15
 */
'use strict';

import React, { Component } from 'react';
import { Button, Popover } from 'antd';
import Menu from './menu';

class MultiSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkedOpts: []
        }
    }

    componentDidMount() {
        let checkedOpts = [];
        if (this.props.mode == 'multiple') {
            checkedOpts = Array.isArray(this.props.value) ? this.props.value : [];
        } else {
            let init = this.props.options.filter(o => o.key == this.props.value);
            checkedOpts = init.length == 1 ? [init[0].key] : [];
        }
        this.setState({ checkedOpts: checkedOpts });
    }    

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.options != nextProps.options) {
            this.setState({ checkedOpts: [] });
        }

        if (this.props.value != nextProps.value) {
            let checkedOpts = [];
            if (this.props.mode == 'multiple') {
                checkedOpts = Array.isArray(nextProps.value) ? nextProps.value : [];
            } else {
                let init = nextProps.options.filter(o => o.key == nextProps.value);
                checkedOpts = init.length == 1 ? [init[0].key] : [];
            }
            this.setState({ checkedOpts: checkedOpts });
        }
    }

    renderButtonText() {
        let text = '';
        if (this.props.mode == 'multiple') {
            text = this.state.checkedOpts.length > 0 ? '选择了' + this.state.checkedOpts.length + '个' : this.props.placeholder || '请选择';
        } else {
            let init = this.props.options.filter(o => o.key == this.state.checkedOpts[0]);
            text = init.length == 1 ? init[0].name : this.props.placeholder || '请选择';
        }

        return text;
    }

    triggerChange = value => {
        this.setState({ checkedOpts: value });
        if (this.props.mode == 'multiple') {
            this.props.onChange(value);
        } else {
            this.props.onChange(value.length > 0 ? value[0] : undefined);
        }
    }

    render() {
        const { style } = this.props;

        return (
            <div style={{ display: 'inline-block' }}>
                <Popover placement="bottom" trigger="click"
                    content={<Menu checkedOpts={this.state.checkedOpts} {...this.props} onChange={this.triggerChange} />}
                    title="" style={{ width: 400 }}>
                    <Button style={style || { width: 280 }}>{this.renderButtonText()}</Button>
                </Popover>
            </div>
        );
    }
}

export default MultiSelect;