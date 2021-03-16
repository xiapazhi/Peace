'use strict';

import moment from 'moment'
import React, { useRef } from 'react';
import { Modal } from "antd";
import { connect } from "react-redux";
import { Form } from '@peace/components'
import { getAppMessage, createAppMessage, editAppMessage, } from '../actions/appMessage';

const AppMessageForm = (props) => {
    const { dispatch, editData, visible, hiddenForm, projects } = props
    const _formRef = useRef(null)

    const reGet = (res) => {
        if (res.success) {
            dispatch(getAppMessage())
            hiddenForm()
        }
    }

    const submit = () => {
        const { current } = _formRef
        current.validateFields().then(values => {
            if (editData) {
                dispatch(editAppMessage(editData.id, values)).then(res => reGet(res));
            } else {
                dispatch(createAppMessage(values)).then(res => reGet(res));
            }
        })
    }

    return (
        <Modal
            title={editData ? '编辑项目公告' : '新建项目公告'}
            visible={visible}
            onCancel={hiddenForm}
            onOk={submit}
            okText="确定"
            cancelText="取消"
            width={800}
            maskClosable={false}
            destroyOnClose
        >
            <Form
                ref={_formRef}
                formItems={[{
                    type: "Select",
                    id: "projectId",
                    label: "项目",
                    optionsSrc: projects.map(p => ({
                        id: p.id,
                        name: p.name
                    })),
                    rules: [{ required: true }],
                }, {
                    type: 'DatePicker',
                    id: 'expiredTime',
                    label: '停止播报时间',
                    rules: [{ required: true, message: '不能为空!' }],
                    itemProps: {
                        style: { width: '100%' },
                        format: 'YYYY-MM-DD HH:mm:ss',
                        showTime: true,
                    }
                }, {
                    type: "Input",
                    id: "title",
                    label: "标题",
                    rules: [{
                        required: true, message: '请输入标题',
                    }],
                    itemProps: {
                        maxLength: 50,
                        placeholder: "标题",
                    },
                }, {
                    type: "Text",
                    id: "content",
                    label: "内容",
                    rules: [{ max: 2000, message: '描述最长为2000个字符', }],
                    itemProps: {
                        autoSize: { minRows: 15, maxRows: 20 },
                        placeholder: "内容",
                    },
                }]}
                formItemLayout={{ labelCol: { span: 24 }, wrapperCol: { span: 24 } }}
                popupContainerId="AppMessageForm"
                dataToEdit={
                    editData ?
                        {
                            projectId: editData.projectId,
                            title: editData.title,
                            content: editData.content,
                            expiredTime: moment(editData.expiredTime),
                        } : {
                            projectId: null,
                            title: '',
                            content: '',
                            expiredTime: null,
                        }
                }
            />
        </Modal>
    )
}

function mapStateToProps(state) {
    const { auth } = state;
    return {
        user: auth.user,
    };
}

export default connect(mapStateToProps)(AppMessageForm)