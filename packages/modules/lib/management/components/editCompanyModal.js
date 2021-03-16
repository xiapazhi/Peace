'use strict'

import React, { Component, useRef } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { region } from '@peace/utils';
import { Form } from '@peace/components'
import { editCompanyList, getEnterprisesDetails } from '../actions/company'

const EditCompanyModal = (props) => {
    const { dispatch, user, visible, closeModal, enterprises } = props
    const _formRef = useRef(null)

    const renderFormItems = () => {
        return [{
            type: "Cascader",
            id: "region",
            label: "所在地区",
            optionsSrc: region,
            placeholder: "请选择所在地区",
            rules: [{ required: true, message: '地区不能为空', }],
        }, {
            type: "Select",
            id: "scale",
            label: "规模",
            optionsSrc: ["1-20人", "21-50人", "51-100人", "101-200人", "201-500人", "500人以上"].map(s => (
                { id: s, name: s }
            )),
            rules: [{ required: true }],
        }]
    }

    const confirm = () => {
        const { current } = _formRef
        current.validateFields().then(values => {
            dispatch(editCompanyList(enterprises.id, {
                "scale": values.scale,
                "region": values.region
            })).then(res => {
                if (res.success) {
                    dispatch(getEnterprisesDetails(user.id));
                    closeModal()
                }
            })
        })
    }

    let newRegion = []
    if (enterprises.region) {
        const region = enterprises.region.replace("{", '').replace("}", "").split(',')
        for (var i = 0; i < region.length; i++) {
            newRegion.push(parseInt(region[i]))
        }
    }

    const editData = {
        region: newRegion.map(s => String(s)),
        scale: enterprises.scale
    }

    return (
        <Modal
            maskClosable={false}
            title="修改企业信息"
            visible={visible}
            onOk={confirm}
            onCancel={closeModal}
        >
            <Form
                ref={_formRef}
                formItems={renderFormItems()}
                formItemLayout={{ labelCol: { span: 5 }, wrapperCol: { span: 19 } }}
                popupContainerId="editCompanyForm"
                dataToEdit={editData}
            />
        </Modal>
    )
}

function mapStateToProps(state) {
    const { auth, global, enterprises } = state;
    return {
        user: auth.user,
        isRequesting: enterprises.isRequesting,
        enterprises: enterprises.data || {},
        resourceRoot: global.resourceRoot
    };
}

export default connect(mapStateToProps)(EditCompanyModal);
