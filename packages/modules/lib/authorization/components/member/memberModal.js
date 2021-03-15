'use strict'

import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Form } from '@peace/components'
import { Modal, Tabs, message } from 'antd';
import {
    addMembers, modifyMembers
} from '../../actions/member';

const MemberModal = (props) => {
    const { dispatch, user, isRequesting, closeModal, authorData, member, done } = props;
    const _formRef = useRef(null)
    const _formRef2 = useRef(null)
    const [editData, setEditData] = useState(
        member ? {
            memberName: member.showname,
            memberUserName: member.username,
            email: member.email,
            phone: member.phone,
            enable: Boolean(member.enabled),
            ownPart: [member.departmentId, member.postId].map(s => String(s))
        } : {})
    const [isSA] = useState(member && member.portal == 'A')
    let memberModalActiveKey = 1

    const confirm = async () => {
        const { current } = _formRef
        const { current: current2 } = _formRef2
        let basicV = {}
        try {
            basicV = await current.validateFields()
        } catch (error) {
            if (memberModalActiveKey != 1) {
                return message.warn('请将[基本信息设置]填写完整')
            }
        }
        let rePswdV = {}
        try {
            rePswdV = current2 ? await current2.validateFields() : {}
        } catch (error) {
            if (memberModalActiveKey != 2) {
                return message.warn('请将[修改密码]填写完整')
            }
        }
        let values = {
            ...basicV,
            ...rePswdV,
        }
        const params = {
            "enterpriseId": user.orgId,
            "name": values.memberName,
            "username": values.memberUserName,
            "password": values.JcAddpassword,
            "phone": values.phone,
            "email": values.email,
            "enabled": Boolean(values.enable),
        }
        const postId = values.ownPart[1];
        if (member) {
            if (values.confirmJCpassword) {
                params.password = values.confirmJCpassword;
            }
            params.postId = postId;
        }
        let isRepeat = false;
        for (let s of authorData) {
            for (let k of s.posts) {
                for (let x of k.members) {
                    //判断用户名重复
                    if (!member && x.username == params.username) {// 新增
                        isRepeat = true
                    } else if (member && x.username == params.username && x.id != member.id) {//修改
                        isRepeat = true
                    }
                    if (isRepeat) {
                        return message.error("该用户名已被使用");
                    }
                }
            }
        }
        if (member) {
            dispatch(modifyMembers(member.id, params)).then(res => {
                done(res)
            })
        } else {
            dispatch(addMembers(postId, params)).then(res => {
                done(res)
            })
        }
    }

    let memberItems = [{
        type: "Input",
        id: "memberName",
        label: "姓名",
        rules: [{ required: true, message: '不能为空!' }],
        itemProps: {
            maxLength: 16,
            disabled: isSA
        },
    }, {
        type: "Input",
        id: "memberUserName",
        label: "用户名",
        rules: [
            { pattern: /^[a-z0-9A-Z_]{5,20}$/, message: '账号由5-20位字母、数字或_组成' },
            { required: true, message: '用户名不能为空', }
        ],
        itemProps: {
            maxLength: 20,
        },
    }, {
        type: "Input",
        id: "email",
        label: "邮箱",
        rules: [{ type: 'email', message: '邮箱格式错误!', }],
        itemProps: {
            disabled: isSA
        },
    }, {
        type: "Input",
        id: "phone",
        label: "电话",
        rules: [{ pattern: /^1[3|4|5|7|8|9]\d{9}$/, message: '手机号码无效' }],
        itemProps: {
            disabled: isSA
        },
    }, {
        type: "Switch",
        id: "enable",
        label: "是否启用",
        containerProps: { valuePropName: 'checked' },
        itemProps: {
            checkedChildren: "是",
            unCheckedChildren: "否",
            disabled: isSA
        },
    }, {
        type: "Cascader",
        id: "ownPart",
        label: "所属部门",
        rules: [{ required: true, message: '所属部门不能为空!' }],
        optionsSrc: authorData.map(s => {
            return {
                value: s.departmentId,
                label: s.departmentName,
                disabled: s.posts.length == 0,
                children: s.posts.map(k => {
                    return {
                        value: k.id,
                        label: k.type ? k.name + '(部门主管)' : k.name,
                        disabled: k.portal == 'A'
                    }
                })
            };
        }),
        rules: [{ required: true }],
    }]

    if (!member) {
        memberItems.splice(2, 0, {
            type: "Input",
            id: "JcAddpassword",
            label: "密码",
            rules: [
                { pattern: /^[a-z0-9A-Z_]{6,20}$/, message: '密码由6-20位字母、数字或_组成' },
                { required: true, message: '密码不能为空', }
            ],
            itemProps: {
                maxLength: 20,
                type: "password"
            },
        })
    }

    const resetPswdItems = [{
        type: "Input",
        id: "editJCpassword",
        label: "密码",
        rules: [
            { pattern: /^[a-z0-9A-Z_]{6,20}$/, message: '密码由6-20位字母、数字或_组成' },
        ],
        itemProps: {
            placeholder: "请输入密码",
            maxLength: 20,
            type: "password"
        },
    }, {
        type: "Input",
        id: "confirmJCpassword",
        label: "确认密码",
        rules: [{
            validator: async (rule, value) => {
                const { current } = _formRef2
                if (current.getFieldValue('editJCpassword') != value) {
                    throw new Error('两次输入的密码不一致!');
                }
            }
        }],
        itemProps: {
            placeholder: "请再次确认密码",
            type: "password"
        },
    },];

    return (
        <Modal
            title={member ? '编辑成员信息' : '新增成员'}
            visible
            maskClosable={false}
            onOk={confirm}
            onCancel={closeModal}
            confirmLoading={isRequesting}
            destroyOnClose
        >
            {
                member ?
                    <Tabs defaultActiveKey="1" onChange={(v) => {
                        memberModalActiveKey = v
                    }}>
                        <Tabs.TabPane tab="基本信息设置" key="1">
                            <Form
                                ref={_formRef}
                                formItems={memberItems}
                                formItemLayout={{ labelCol: { span: 5 }, wrapperCol: { span: 19 } }}
                                popupContainerId="memberForm"
                                dataToEdit={editData}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="修改密码" key="2">
                            <Form
                                ref={_formRef2}
                                formItems={resetPswdItems}
                                formItemLayout={{ labelCol: { span: 5 }, wrapperCol: { span: 19 } }}
                                popupContainerId="member2Form"
                                dataToEdit={editData}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                    :
                    <Form
                        ref={_formRef}
                        formItems={memberItems}
                        formItemLayout={{ labelCol: { span: 5 }, wrapperCol: { span: 19 } }}
                        popupContainerId="memberForm"
                    />
            }
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

export default connect(mapStateToProps)(MemberModal)