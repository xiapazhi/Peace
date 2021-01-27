'use strict';

import React, { Component } from 'react';
import { Spin as AntdSpin, Icon } from 'antd';

class Spin extends Component {
    render() {
        const { spinning, indicator } = this.props;

        const defaultAntIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

        let props = {};
        if (indicator) props.indicator = typeof indicator == 'boolean' && defaultAntIcon || indicator;

        return (
            <AntdSpin spinning={spinning} {...props}>
                {this.props.children}
            </AntdSpin>
        );
    }
}

export default Spin;
