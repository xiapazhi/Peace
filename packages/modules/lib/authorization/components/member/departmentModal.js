'use strict'

import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Form } from '@peace/components'
import { Modal } from 'antd';
import {
    addDepartment, modifyDepartment
} from '../../actions/member';

const DepartmentModal = (props) => {
    const { dispatch, isRequesting, user, closeModal, authorData, departmentId, done } = props
    const _formRef = useRef(null)
    const [editData, setEditData] = useState({
        departmentName: departmentId ?
            authorData.find(ad => ad.departmentId == departmentId).departmentName : undefined
    })

    const renderFormItems = () => {
        return [{
            type: "Input",
            id: "departmentName",
            label: "部门名称",
            rules: [{
                required: true, message: '部门名称不能为空',
            }, {
                max: 8, message: '名称长度不能大于8'
            }, {
                whitespace: true, message: '请勿输入空格'
            }],
            itemProps: {
                maxLength: 8,
            },
        }]
    }

    const confirm = () => {
        const { current } = _formRef
        current.validateFields().then(({ departmentName }) => {
            for (let s of authorData) {
                if ((s.departmentName === departmentName && !departmentId) || (s.departmentName === departmentName && departmentId != s.departmentId)) {
                    return message.warn('已有同名部门');
                }
            }
            const params = { name: departmentName, }
            if (departmentId) {
                dispatch(modifyDepartment(departmentId, params)).then(res => { done(res) })
            } else {
                dispatch(addDepartment(user.orgId, params)).then(res => { done(res) })
            }
        })
    }

    return (
        <Modal
            title={departmentId ? '编辑部门名称' : '新增部门'}
            visible
            maskClosable={false}
            onOk={confirm}
            onCancel={closeModal}
            confirmLoading={isRequesting}
            destroyOnClose
        >
            <Form
                ref={_formRef}
                formItems={renderFormItems()}
                formItemLayout={{ labelCol: { span: 5 }, wrapperCol: { span: 19 } }}
                popupContainerId="departmentForm"
                dataToEdit={editData}
            />
        </Modal>
    )
}

function mapStateToProps(state) {
    const { member, authorData, auth } = state;
    return {
        user: auth.user,
        isRequesting: authorData.isRequesting || member.isRequesting,
        authorData: authorData.data || [],
    };
}
export default connect(mapStateToProps)(DepartmentModal)