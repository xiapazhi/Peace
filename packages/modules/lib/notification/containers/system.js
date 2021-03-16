import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux'
import SystemNoticeList from '../components/systemNoticeList'
import { getNoticeList, editNoticeList, RemoveAllNotice } from '../actions/notice';
import moment from 'moment';

const TabPane = Tabs.TabPane;

const SystemNotice = props => {
    const { dispatch, user, items } = props

    const getNotice = () => {
        dispatch(getNoticeList(user.id))
    }

    useEffect(() => {
        getNotice()
    }, [])

    const onchange = contentId => {
        dispatch(editNoticeList(contentId)).then(res => {
            if (res.success) {
                getNotice()
            }
        })
    }

    const removeAllNotice = () => {
        dispatch(RemoveAllNotice(user.id)).then(res => {
            if (res.success) {
                getNotice()
            }
        })
    }

    const { read, unread } = items
    let map = {}
    let dest = [];
    if (read && unread) {
        let arr = read.concat(unread);
        for (var i = 0; i < arr.length; i++) {
            var ai = arr[i];
            const generate_time = moment(ai.generate_time).format('YYYY-MM-DD')
            if (!map[generate_time]) {
                dest.push({
                    titleTime: generate_time,
                    content: [{ contentId: ai.id, isReaded: ai.readed, contentTime: ai.generate_time, content: ai.content, imgSrc: '../../../assets/images/photo.png' }]
                });
                map[generate_time] = ai;
            } else {
                for (var j = 0; j < dest.length; j++) {
                    var dj = dest[j];
                    if (dj.titleTime == moment(ai.generate_time).format('YYYY-MM-DD')) {
                        dj.content.push({ contentId: ai.id, isReaded: ai.readed, contentTime: ai.generate_time, content: ai.content, imgSrc: '../../../assets/images/photo.png' });
                        break;
                    }
                }
            }
        }
    }

    return (
        <Tabs defaultActiveKey="1" animated>
            <TabPane tab=" 未读 " key="1">
                <SystemNoticeList content={dest} isReaded={false} onchange={onchange} removeAllNotice={removeAllNotice} />
            </TabPane>
            <TabPane tab=" 已读 " key="2">
                <SystemNoticeList content={dest} isReaded={true} />
            </TabPane>
        </Tabs>
    )
}

function mapStateToProps(state) {
    const { notice, auth } = state;
    return {
        items: notice.data || {},
        user: auth.user,
    };
}

export default connect(mapStateToProps)(SystemNotice) 