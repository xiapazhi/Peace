'use strict';

import React, { useEffect, useState } from 'react';
import { Tree, Row, Col, Spin } from 'antd'
import { connect } from 'react-redux';
import { getAuthorList, getAuthors } from '../actions/author';
import FunctionAuthor from '../components/functionAuthor';
import PerfectScrollbar from 'perfect-scrollbar';

const Resource = (props) => {
    const { user, dispatch, isRequesting, authorData, clientHeight } = props;
    const [selectedKeys, setSelectedKeys] = useState([])
    const [currRole, setCurrRole] = useState({})

    useEffect(() => {
        dispatch(getAuthors(user.orgId))
        dispatch(getAuthorList(user.orgId)).then(res => {
            if (res.success) {
                let firstRole = res.payload.data[0].posts[0];
                setCurrRole(firstRole)
                setSelectedKeys([firstRole.id])
            }
        });
        new PerfectScrollbar('#departmentFlow', { suppressScrollX: true });
        new PerfectScrollbar('#authorsFlow', { suppressScrollX: true });
    }, [])

    return (
        <Spin spinning={isRequesting}>
            <Row gutter={16}>
                <Col span={5}>
                    <div style={{ overflow: 'auto', position: 'relative', height: clientHeight - 53 - 16 - 24 }} id="departmentFlow">
                        {
                            authorData.length ?
                                <Tree
                                    defaultExpandedKeys={[authorData[0].departmentId]}
                                    selectedKeys={selectedKeys}
                                    onSelect={(selectedKeys, info) => {
                                        if (info.selected && String(info.node.key).indexOf('dep') == -1) {
                                            setSelectedKeys(selectedKeys)
                                        }
                                    }}
                                    // showLine
                                    treeData={authorData.map(s => ({
                                        title: s.departmentName,
                                        key: s.departmentId + '_dep',
                                        children: s.posts.map(k => ({
                                            title: <div onClick={() => { setCurrRole(k) }}>{k.name}{k.type ? '(部门主管)' : ''}</div>,
                                            key: k.id,
                                        }))
                                    }))}
                                /> : ''
                        }
                    </div>
                </Col>
                <Col span={19}>
                    <div style={{ overflow: 'auto', position: 'relative', height: clientHeight - 53 - 16 - 24, marginRight: -21, paddingRight: 21 }} id="authorsFlow">
                        <FunctionAuthor
                            currRole={currRole}
                        />
                    </div>
                </Col>
            </Row>
        </Spin>
    )
}


function mapStateToProps(state) {
    const { auth, global, authorData, authors } = state;
    return {
        user: auth.user,
        clientHeight: global.clientHeight,
        isRequesting: authorData.isRequesting,
        authorData: authorData.data || [],
        authors: authors.data || []
    };
}
export default connect(mapStateToProps)(Resource);