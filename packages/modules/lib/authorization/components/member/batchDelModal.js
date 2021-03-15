'use strict'

import { Modal, message } from 'antd';
import { deleteMembers } from '../../actions/member';

const BatchDelModal = (props) => {
    const { selectedRowKeys, authorData, dispatch, user, done } = props

    let members = [];
    authorData.forEach(dep => {
        if (dep.departmentName == '默认') return;
        dep.posts.forEach(post => {
            post.members.forEach(m => {
                if (selectedRowKeys.indexOf(m.id) >= 0) {
                    members.push(m.name);
                }
            });
        })
    });

    if (!members.length) {
        return message.warn('请选择要删除的成员')
    }

    Modal.confirm({
        title: '确定批量删除以下用户?',
        content: members.join('，'),
        okType: 'danger',
        onOk() {
            dispatch(deleteMembers({ ids: selectedRowKeys })).then(res => {
                done(res)
            })
        },
        onCancel() {

        },
    });
}

export default BatchDelModal