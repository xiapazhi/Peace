import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Table, Checkbox, message } from 'antd';
import { modifyAuthor } from '../actions/author';
import { AuthorizationCode } from '$utils';

const CheckboxGroup = Checkbox.Group;
const { ModifyPositionResource, AddDepartment, ModifyDepartmentName, DeleteDepartment } = AuthorizationCode
const plainOptions = {};

class FunctionAuthor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: {},
            indeterminate: {},
            checkAll: {},
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let checkedList = {}
        let checkAll = {}

        if (this.props.currRole.id && nextProps.currRole.id && this.props.currRole.id != nextProps.currRole.id) {
            document.getElementById('orientation-a').click()
        }
        
        nextProps.authors ?
            nextProps.authors.map(s => {
                s.posts.map(k => {
                    k.id == nextProps.currRole.id ?
                        k.resources.map(y => {
                            if (!plainOptions[y.id]) {
                                plainOptions[y.id]
                            }
                            plainOptions[y.id] = y.children.map(t => t.id)
                            checkedList[y.id] = y.children.map(t => t.available == true ? t.id : '')
                            checkAll[y.id] = y.children.every(t => t.available == true)
                            this.state.indeterminate[y.id] = y.children.some(t => t.available == true) && y.children.some(t => t.available == false)
                        }) : ''
                })
            }) : ''
        this.setState({
            checkedList: checkedList,
            checkAll: checkAll,
            indeterminate: this.state.indeterminate
        })
    }

    onChange = (value, id) => {
        let { checkedList, checkAll, indeterminate } = this.state
        if (value.some(id => id == ModifyPositionResource) && checkedList[id] && !checkedList[id].some(id => id == ModifyPositionResource)) {
            message.warning('选择【修改职位权限】后，该职位将拥有全部权限');
        };

        checkedList[id] = value
        const currentList = checkedList[id].filter(s => s != '')
        const totalList = plainOptions[id]
        checkAll[id] = currentList.length === totalList.length
        indeterminate[id] = !!currentList.length && (currentList.length < plainOptions[id].length)
        this.setState({
            checkedList: checkedList,
            indeterminate: indeterminate,
            checkAll: checkAll,
        });
    }

    onCheckAllChange = (e, y) => {
        let { checkedList, checkAll, indeterminate } = this.state
        checkedList[y.id] = e.target.checked ? plainOptions[y.id] : []
        checkAll[y.id] = e.target.checked
        indeterminate[y.id] = false
        this.setState({
            checkedList: checkedList,
            indeterminate: indeterminate,
            checkAll: checkAll,
        });
    }

    renderTableList = (text) => {
        const { currRole } = this.props;
        let data = [];
        const id = text.id
        text.children.map(s => {
            if (currRole.departmentName != "默认" && [AddDepartment, ModifyDepartmentName, DeleteDepartment].some(p => p == s.id)) {

            } else {
                data.push({ label: s.name, value: s.id })
            }
        })
        return (
            <Row>
                <CheckboxGroup
                    disabled={currRole.portal == "A"}
                    options={data}
                    value={this.state.checkedList[id]}
                    onChange={value => this.onChange(value, id)}
                />
            </Row>
        )
    }

    handleSave = () => {
        const { dispatch, currRole } = this.props
        const { checkedList } = this.state
        let data = []
        Object.keys(checkedList).map(key => {
            checkedList[key].some(s => s != "") ?
                data.push(key) : ''
            for (var i in checkedList[key]) {
                checkedList[key][i] != "" ?
                    data.push(checkedList[key][i]) : ''
            }
        })
        dispatch(modifyAuthor(currRole.id, data))
    }

    render() {
        const { authors, currRole, isRequesting } = this.props
        const { indeterminate, checkAll } = this.state
        const dataSource = [];
        authors.map(s => {
            s.posts.map(k => {
                k.id == currRole.id ?
                    k.resources.map(y => {
                        dataSource.push({ key: y.id, func: y, list: y });
                    }) : ''
            })
        });

        const columns = [{
            title: '功能',
            dataIndex: 'func',
            key: 'func',
            width: '20%',
            render: (text, record) => {
                return (
                    <Row>
                        <Checkbox
                            indeterminate={indeterminate[text.id]}
                            onChange={(e) => this.onCheckAllChange(e, text)}
                            checked={checkAll[text.id]}
                            disabled={currRole.portal == "A" ? true : false}
                        >
                            {text.name}
                        </Checkbox>
                    </Row >
                )
            }
        }, {
            title: '列表',
            dataIndex: 'list',
            key: 'list',
            width: '80%',
            render: (text, record) => this.renderTableList(text)
        }];

        return (
            <div>
                <div id="cur-top" style={{ position: "absolute", top: -16 }}></div>
                <a href="#cur-top" id="orientation-a" style={{ position: "absolute" }}></a>
                <Row type="flex" justify="center" style={{ marginBottom: 16 }}>
                    <Col><h3>[ {currRole.name} ] 功能范围</h3></Col>
                </Row>
                {
                    currRole.portal == "A" ?
                        <div>{`说明："${currRole.name}"为系统默认生成用户，具有全部功能权限`}</div> : ''
                }
                <Table bordered pagination={false} loading={isRequesting} columns={columns} dataSource={dataSource} />
                <Row type="flex" justify="center" style={{ marginBottom: 16, marginTop: 16, textAlign: 'center' }}>
                    <Col span="24">
                        {
                            currRole.portal == "A" ? "" :
                                <Button onClick={this.handleSave} style={{ width: '60%' }} type='primary'>保存修改</Button>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { auth, global, authorData, authors } = state;
    return {
        user: auth.user,
        clientHeight: global.clientHeight,
        isRequesting: authors.isRequesting,
        authorData: authorData.data || [],
        authors: authors.data || []
    };
}

export default connect(mapStateToProps)(FunctionAuthor);