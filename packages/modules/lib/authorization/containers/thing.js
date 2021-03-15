import React, { Component } from 'react';
import { Tree, Row, Col, Button, Transfer, Spin, message, } from 'antd'
import { connect } from 'react-redux';
import { getAuthorList, getStructureResources, getDepartmentResources, modifyDepartmentResources } from '../actions/author';
import { PinyinHelper } from '@peace/utils';
import PerfectScrollbar from 'perfect-scrollbar';

class Author extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDepartmentId: null,
            currentRoleId: null,
            currentUserId: null,
            selectedRange: null,
            defaultDept: true,
        }
    }

    componentDidMount() {
        const { dispatch, user } = this.props
        dispatch(getAuthorList(user.orgId))
        dispatch(getStructureResources(user.orgId))
        dispatch(getDepartmentResources(user.orgId)).then(res => {
            if (res.success) {
                let firstDeptId = user.departmentId
                let corDep = res.payload.data.departmentRes[firstDeptId]
                if (corDep) {
                    this.setState({
                        currentDepartmentId: firstDeptId,
                        selectedRange: corDep.structures.map(s => s.toString())
                    })
                }
            }
        })
        new PerfectScrollbar('#departmentFlow', { suppressScrollX: true });
    }

    handleTreeClick = (currentDepartmentId, currentRoleId, currentUserId, type) => {
        const { departmentResources, user } = this.props;
        this.setState({
            currentDepartmentId: currentDepartmentId,
            currentRoleId: currentRoleId,
            currentUserId: currentUserId,
            selectedRange: null
        }, () => {
            let selectedRange = [];
            let defaultDept = true;
            switch (type) {
                case 'department':
                    selectedRange = departmentResources.departmentRes[currentDepartmentId].structures.map(s => s.toString());
                    defaultDept = Boolean(departmentResources.departmentRes[currentDepartmentId].owner || user.departmentName != '默认');
                    break;
                case 'role':
                    selectedRange = departmentResources.roleRes[currentRoleId].structures.map(s => s.toString());
                    defaultDept = Boolean(departmentResources.roleRes[currentRoleId].owner);
                    break;
                case 'user':
                    selectedRange = departmentResources.userRes[currentUserId].structures.map(s => s.toString());
                    defaultDept = Boolean(departmentResources.userRes[currentUserId].owner);
                    break;
            }
            setTimeout(() => {
                this.setState({ selectedRange: selectedRange, defaultDept })
            }, 500);
        });
    }

    handleSelectChange = (targetKeys) => {
        const { user } = this.props;
        const { defaultDept } = this.state;
        if (defaultDept) {
            if (user.departmentName != '默认') {
                message.warn('非管理员无法修改部门可访问结构物');
            } else {
                message.warn('系统默认部门/所有者的数据范围无法修改');
            }
        } else {
            this.setState({ selectedRange: targetKeys })
        }
    }

    handleSave = () => {
        const { dispatch, user } = this.props;
        const { currentDepartmentId, currentRoleId, currentUserId, selectedRange } = this.state;
        dispatch(modifyDepartmentResources(currentDepartmentId, currentRoleId, currentUserId, selectedRange))
            .then(() => dispatch(getDepartmentResources(user.orgId)));
    }

    render() {
        const { isRequesting, authorData, structures, user, clientHeight } = this.props;
        const { currentDepartmentId, currentRoleId, currentUserId, defaultDept, selectedRange } = this.state;

        return (
            <span>
                <Row gutter={16}>
                    <Col span={5}>
                        <div style={{ overflow: 'auto', position: 'relative', height: clientHeight - 53 - 16 - 24 }} id="departmentFlow">
                            <Tree
                                // showLine
                                selectedKeys={
                                    currentDepartmentId ?
                                        currentRoleId ?
                                            currentUserId ?
                                                ["member-" + currentUserId] :
                                                ["post-" + currentRoleId] :
                                            [currentDepartmentId] :
                                        authorData.length ?
                                            [authorData[0].departmentId] :
                                            []
                                }
                                defaultExpandAll={user.departmentName != '默认'}
                                treeData={
                                    authorData.map(s => ({
                                        title:
                                            <span onClick={() => {
                                                this.handleTreeClick(s.departmentId, null, null, 'department');
                                            }}>
                                                {s.departmentName}
                                            </span>,
                                        key: s.departmentId,
                                        children: s.posts.map(k => ({
                                            title: <span >{k.name}{k.type ? '(部门主管)' : ''}</span>,
                                            key: "post-" + k.id,
                                            children: k.members.map(m => ({
                                                showIcon: true,
                                                title: <span onClick={() => this.handleTreeClick(s.departmentId, k.id, m.id, 'user')}>{m.name}</span>,
                                                key: "member-" + m.id,
                                            }))
                                        }))
                                    }))
                                }
                            />
                        </div>
                    </Col>

                    <Col span={19}>
                        <h3>默认(所有者部门)</h3>
                        <span>系统默认生成，默认具有全部结构物访问权限</span>
                        <div style={{ marginTop: '20px' }}>
                            {
                                selectedRange && !isRequesting?
                                    <div>
                                        <Transfer
                                            rowKey={item => item.id.toString()}
                                            render={item => item.name}
                                            titles={['可选结构物', '已选结构物']}
                                            // disabled={defaultDept}
                                            showSearch
                                            dataSource={structures}
                                            targetKeys={selectedRange}
                                            onChange={targetKeys => this.handleSelectChange(targetKeys)}
                                            filterOption={(inputValue, option) => {
                                                const { name } = option;
                                                return name.indexOf(inputValue) > -1 || PinyinHelper.isPinyinMatched(name, inputValue);
                                            }}
                                            listStyle={{
                                                width: '45%',
                                                height: clientHeight - 53 - 16 - 24 - 30 - 17 - 20 - 40 - 56 - 32 - 24,
                                            }} />
                                        {
                                            defaultDept ? null :
                                                <Button style={{ marginTop: 24 }} type="primary" onClick={this.handleSave}>保存修改</Button>
                                        }
                                    </div>
                                    :
                                    <div style={{ textAlign: 'center', margin: 32 }}> <Spin /> </div>
                            }
                        </div>
                    </Col>
                </Row>
            </span>
        )
    }
}

function mapStateToProps(state) {
    const { auth, authorData, structures, departmentResources, global } = state;
    const user = auth.user;
    let structures_ = [];
    if (user.departmentName != '默认') {
        if (structures.data && departmentResources.data) {
            let userSeeDepart = departmentResources.data[String(user.departmentId)];
            if (userSeeDepart) {
                let userSeeStructure = userSeeDepart.structures;
                for (let s of structures.data) {
                    if (userSeeStructure.some(us => us == s.id)) {
                        structures_.push(s);
                    }
                }
            }
        }
    } else {
        structures_ = structures.data || []
    }

    return {
        user: user,
        clientHeight: global.clientHeight,
        isRequesting: authorData.isRequesting || structures.isRequesting || departmentResources.isRequesting,
        authorData: authorData.data || [],
        structures: structures_,
        departmentResources: departmentResources.data || []
    };
}

export default connect(mapStateToProps)(Author);