import React, { Component } from 'react';
import { Checkbox, Input } from 'antd';
import Ps from 'perfect-scrollbar';
import { PinyinHelper } from '@peace/utils';
const Search = Input.Search;

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKeyVal: "",
        }
    }

    componentDidMount() {
        new Ps('#options', { suppressScrollX: true });
    }

    onSingleChange = (e) => {
        if (e.target.checked) {
            this.props.onChange([e.target.value]);
        } else {
            this.props.onChange([]);
        }
    };

    onMultipleChange = (e) => {
        let selectOpts = this.props.checkedOpts.filter(o => o != e.target.value);
        if (e.target.checked) {
            selectOpts = selectOpts.concat([e.target.value]);
        }
        this.props.onChange(selectOpts);
    };

    onCheckAll = e => {
        const { searchKeyVal } = this.state;
        const { options, onChange } = this.props;
        if (e.target.checked) {
            let allKeys = [];
            if (searchKeyVal) {
                allKeys = options.filter(o => {
                    return PinyinHelper.isPinyinMatched(o.name, searchKeyVal) || o.name.indexOf(searchKeyVal) > -1
                }).map(so => so.key);
            } else {
                allKeys = options.map(o => o.key)
            }
            onChange(allKeys);
        } else {
            onChange([]);
        }
    }

    renderOptions = options => {
        const { searchKeyVal } = this.state;
        if (options.length >= 1) {
            let comps = [];
            options.map((s) => {
                if ((searchKeyVal && (PinyinHelper.isPinyinMatched(s.name, searchKeyVal) || s.name.indexOf(searchKeyVal) > -1)) || !searchKeyVal) {
                    comps.push(
                        <div key={s.key}>
                            <Checkbox value={s.key}
                                checked={this.props.checkedOpts.some(o => o == s.key)}
                                onChange={this.props.mode == 'multiple' ? this.onMultipleChange : this.onSingleChange}>
                                {s.name}
                            </Checkbox>
                        </div>
                    )
                }
            });

            if (this.props.mode == 'multiple' && this.props.options.length > 0) {
                comps.unshift(
                    <div key={'all'}>
                        <Checkbox value={'all-ch'}
                            checked={this.props.checkedOpts.length == comps.length && comps.length}
                            onChange={this.onCheckAll}>
                            全选
                        </Checkbox>
                    </div>
                )
            }

            return comps;
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        let currOptions = this.props.options;
        let nextOptions = nextProps.options;
        if (currOptions.length == nextOptions.length) {
            for (let co of currOptions) {
                if (!nextOptions.some(no => no.key == co.key)) {
                    this.setState({ searchKeyVal: '' });
                    document.getElementById('searchInput').value = '';
                    break;
                }
            }
        } else {
            this.setState({ searchKeyVal: '' });
            if (document.getElementById('searchInput'))
                document.getElementById('searchInput').value = '';
        }

    }

    render() {
        const { options, style, checkedOpts, onChange } = this.props;
        let selectHeight = options.length > 4 ? 300 : 135;
        return (
            <div>
                {
                    options.length > 0 ?
                        <Search
                            id="searchInput"
                            placeholder="筛选"
                            style={{ width: "100%" }}
                            onSearch={value => {
                                this.setState({
                                    searchKeyVal: value
                                });
                                if (value) {
                                    let nextCheckedOpts = [];
                                    for (let k of checkedOpts) {
                                        let optionK = options.find(o => o.key == k);
                                        if (optionK) {
                                            if (PinyinHelper.isPinyinMatched(optionK.name, value) || optionK.name.indexOf(value) > -1) {
                                                nextCheckedOpts.push(k)
                                            }
                                        }
                                    }
                                    onChange(nextCheckedOpts);
                                }
                            }}
                        />
                        : ''
                }
                <div id="options" style={{ minWidth: style.width || 280, paddingRight: 20, height: selectHeight, position: 'relative', fontSize: 22 }}>
                    <div style={{ marginRight: 20 }}>

                        {
                            this.renderOptions(options)
                        }
                    </div>
                </div>
            </div>
        )
    }
}
