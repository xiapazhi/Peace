import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Row, Col, Spin } from 'antd';
import { RouteTable, AuthorizationCode } from '$utils';
import { region, RouteRequest, Func } from '@peace/utils';
import { editCompanyList, getEnterprisesDetails } from '../actions/company'
import EditCompanyModal from '../components/editCompanyModal'
import { ImageCropper } from '@peace/components'

const { ModifyEnterpriseLogo, ModifyEnterprise } = AuthorizationCode

class Company extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            companyModal: false,
            appSecretVisible: false,
        }
    }

    UNSAFE_componentWillMount() {
        const { dispatch, user } = this.props;
        dispatch(getEnterprisesDetails(user.id));
    }

    handleCropperOk = (fd) => {
        const { dispatch, enterprises, user } = this.props
        RouteRequest.post(RouteTable.resourceUpload, fd).then(res => {
            this.setState({ visible: false })
            dispatch(editCompanyList(enterprises.id, {
                "logo": res.filename
            })).then(_ => {
                dispatch(getEnterprisesDetails(user.id));
            })
        })
    }

    showCompanyModal = () => {
        this.setState({ companyModal: true })
    }

    setAppSecretVisible = () => {
        let visible = this.state.appSecretVisible;
        this.setState({
            appSecretVisible: !visible
        })
    }

    render() {
        const { user, resourceRoot, enterprises, isRequesting } = this.props;
        const { appSecretVisible, companyModal, visible } = this.state

        let newRegion = []
        if (enterprises.region) {
            const region = enterprises.region.replace("{", '').replace("}", "").split(',')
            for (var i = 0; i < region.length; i++) {
                newRegion.push(parseInt(region[i]))
            }
        }

        let str = ''
        if (newRegion.length == 2) {
            region.map(s => {
                s.value == newRegion[0] ? s.children.map(k => {
                    k.value == newRegion[1] ? str = s.label + '/' + k.label : ''
                }) : ''
            })
        } else if (newRegion.length == 3) {
            region.map(s => {
                s.value == newRegion[0] ? s.children.map(k => {
                    k.value == newRegion[1] ?
                        k.children.map(x => {
                            x.value == newRegion[2] ? str = s.label + '/' + k.label + '/' + x.label : ''
                        }) : ''
                }) : ''
            })
        }

        const logo = enterprises.logo ?
            enterprises.logo : '/assets/images/empty.png'

        return (
            <Spin spinning={isRequesting}>
                <Row>
                    <div style={{ width: '100%' }}>
                        <img style={{ width: '130px', height: '100px', borderRadius: '10px' }} src={resourceRoot + "/" + logo} />
                    </div>
                    {Func.judgeRights(ModifyEnterpriseLogo, <a onClick={() => this.setState({ visible: true })} style={{ marginLeft: '40px' }}>修改logo</a>)}
                    <ImageCropper
                        visible={visible}
                        handleCropperOk={this.handleCropperOk}
                        handleCancel={() => {
                            this.setState({ visible: false })
                        }}
                        originalImage={resourceRoot + "/" + enterprises.logo}
                    />
                </Row>
                <p style={{ marginTop: '30px' }}>
                    <span style={{ fontSize: 19 }}><b>基础设置</b></span>
                </p>
                <div style={{ borderTopColor: '#D9D9D9', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
                    <Row style={{ marginTop: '30px' }}>
                        <Col span={3}>公司名称：</Col>
                        <Col span={21}>{enterprises.name}</Col>
                    </Row>
                    <Row style={{ marginTop: '30px' }}>
                        <Col span={3}>域名：</Col>
                        <Col span={21}>{enterprises.domain}</Col>
                    </Row>
                    <Row style={{ marginTop: '30px' }}>
                        <Col span={3}>AppID：</Col>
                        <Col span={21}>{enterprises.appKey}</Col>
                    </Row>
                    <Row style={{ marginTop: '30px' }}>
                        <Col span={3}>AppSecret：</Col>
                        <Col span={21}>
                            {appSecretVisible ? enterprises.appSecret : '******'}
                            <span onClick={this.setAppSecretVisible} style={{ cursor: 'pointer', marginLeft: 4 }}>
                                {appSecretVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </span>
                        </Col>
                    </Row>
                </div>

                <p style={{ marginTop: '30px' }}>
                    <span style={{ fontSize: 19 }}>
                        <b>企业信息</b>
                    </span>
                    {Func.judgeRights(ModifyEnterprise, <a onClick={this.showCompanyModal} style={{ marginLeft: '15px', }}>修改</a>)}
                </p>
                <div style={{ borderTopColor: '#D9D9D9', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
                    <Row style={{ marginTop: '30px' }}>
                        <Col span={2}>地区：</Col>
                        <Col span={10}>{str}</Col>
                    </Row>
                    <Row style={{ marginTop: '30px' }}>
                        <Col span={2}>规模：</Col>
                        <Col span={10}>{enterprises.scale}</Col>
                    </Row>
                </div>

                <EditCompanyModal
                    visible={companyModal}
                    closeModal={() => {
                        this.setState({ companyModal: false })
                    }}
                />
            </Spin>
        )
    }
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

export default connect(mapStateToProps)(Company);