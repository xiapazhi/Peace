import React, { Component } from 'react';
import { Button, Row, Col, Icon } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

class SystemNoticeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: {}
        }
    }

    handleClick = () => {
        this.props.removeAllNotice();
    }

    onChange = (contentId) => {
        this.props.onchange(contentId);
    }

    renderList = (content) => {
        let array = []
        content.content.map(s => {
            array.push(s.isReaded == true ? 'true' : 'false')
        })
        let everyResult = array.some(function (item, index, array) {
            return item == 'false';
        })
        if (everyResult == true) {
            return (
                <div key={content.titleTime} style={{ marginTop: '30px', width: '100%' }}>
                    <span style={{ color: 'grey', fontSize: '14' }}>{content.titleTime}</span>
                    <div style={{ borderTopColor: '#D9D9D9', borderTopWidth: '1px', borderTopStyle: 'solid', width: '100%' }}>
                        {
                            content.content.map(s => {
                                return s.isReaded == false ?
                                    (
                                        <Row key={s.contentId} style={{ marginTop: '20px' }}>
                                            <Col span={2}><img style={{ width: '60%', height: '60%', borderRadius: '50%' }} src={s.imgSrc} /></Col>
                                            <Col span={16}>
                                                <p style={{ marginTop: 10 }}>系统消息: {moment(s.contentTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                                                <p style={{ marginTop: 10 }}>{s.content}
                                                    <div style={{ visibility: 'hidden' }}>段落示意：组件拖出来特别多一个一个删麻烦，这个问题，首先将组件拖入画布中，然后按住“shift”键，用鼠标点击要使用的组件，使该组件取消选择。再点击delete，即可删除剩余不需要使用的组件消选择。再点击delete，即可删除剩余不需要使用的组件。Paragraph example</div>
                                                </p>
                                            </Col>
                                            <Col style={{ textAlign: 'right', marginTop: 10, fontSize: 22 }} span={5}>
                                                {
                                                    <Button onClick={this.onChange.bind(s, s.contentId)}> <Icon type="check" /></Button>
                                                }
                                            </Col>
                                        </Row>) : ''
                            })
                        }

                    </div>
                </div>
            )
        }
    }
    renderReadedList = (content) => {
        let array = []
        content.content.map(s => { array.push(s.isReaded == true ? 'true' : 'false') })
        let everyResult = array.some(function (item, index, array) {
            return item == 'true';
        })
        if (everyResult == true) {
            return (
                <div key={content.titleTime} style={{ marginTop: '30px' }}>
                    <span style={{ color: 'grey', fontSize: '14' }}>{content.titleTime}</span>
                    <div style={{ borderTopColor: '#D9D9D9', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
                        {
                            content.content.map(s => {
                                return s.isReaded == true ?
                                    (<Row style={{ marginTop: '20px' }}>
                                        <Col span={2}><img style={{ width: '60%', height: '60%', borderRadius: '50%' }} src={s.imgSrc} /></Col>
                                        <Col span={16}>
                                            <p style={{ marginTop: 10 }}>系统消息: {moment(s.contentTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                                            <p style={{ marginTop: 10 }}>{s.content}</p>
                                        </Col>
                                    </Row>) : ''
                            })
                        }
                    </div>
                </div>
            )
        }
    }
    render() {
        let hasData = false;
        let hasReadedData = false;
        this.props.content.map(s => {
            s.content.map(k => {
                k.isReaded == false ? hasData = true : hasReadedData = true
            })
        })
        return (
            <div style={{
                minWidth: '1200px', height: '500px',
                background:
                    this.props.isReaded ?
                        hasReadedData ?
                            '' : 'url("/assets/images/empty.png") no-repeat center center'
                        : hasData ? '' : 'url("/assets/images/empty.png") no-repeat center center'
            }}>
                {
                    this.props.isReaded ?
                        '' : hasData ?
                            <Button onClick={this.handleClick}>全部标记为已读</Button> : ''
                }{
                    this.props.content.map(s => {
                        return this.props.isReaded == false ? this.renderList(s) : this.renderReadedList(s);
                    })
                }
            </div>
        )
    }
}

export default SystemNoticeList;