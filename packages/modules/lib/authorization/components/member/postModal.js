'use strict'

import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Form } from '@peace/components'
import { Modal } from 'antd';
import { getAuthorList } from '../../actions/author';
import {
    addPost, modifyPost
} from '../../actions/member';

const PostModal = (props) => {
    const { dispatch, isRequesting, user, closeModal, authorData, post, done } = props
    const _formRef = useRef(null)

    const confirm = () => {
        const { current } = _formRef
        current.validateFields().then(values => {
            const { departmentId, name } = values;
            let isRepeat = authorData.some(s => {
                return s.posts.some(k => {
                    return k.name === name && s.departmentId == departmentId && (!post || post.id != k.id);
                })
            });

            if (isRepeat) {
                message.error("同一部门下职位名称不能重复！")
                return;
            }
            if (post) {
                dispatch(modifyPost(post.id, values)).then((res) => {
                    done(res)
                });
            } else {
                dispatch(addPost(departmentId, values)).then((res) => {
                    done(res)
                });
            }
        })
    }

    const renderFormItems = () => {
        let items = [{
            type: "Input",
            id: "name",
            label: "职位名称",
            rules: [
                { max: 8, message: '职位名称最大长度不超过8' },
                { required: true, message: '请输入职位名称!' }
            ],
            itemProps: {
                maxLength: 8,
            },
        }]
        if (!post) {
            items.push({
                type: "Select",
                id: "departmentId",
                label: "所属部门",
                placeholder: "请选择部门",
                optionsSrc: authorData.map(ad => ({ id: ad.departmentId, name: ad.departmentName, disabled: ad.departmentName == "默认" })),
                rules: [{ required: true, message: '请选择部门!' }],
                itemProps: {},
            })
        }
        items.push({
            type: "Switch",
            id: "type",
            label: "职业类型",
            containerProps: { valuePropName: 'checked' },
            itemProps: {
                checkedChildren: "部门主管",
                unCheckedChildren: "非部门主管"
            },
        })
        if (!post) {
            items.push({
                type: "Text",
                id: "description",
                label: "描述",
                itemProps: {
                    autosize: { minRows: 3, maxRows: 6 },
                    maxLength: 128,
                },
            })
        }
        return items
    }

    return (
        <Modal
            title={post ? '编辑职位' : '新增职位'}
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
                popupContainerId="postsForm"
                dataToEdit={post || {}}
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

export default connect(mapStateToProps)(PostModal)