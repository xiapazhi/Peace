'use strict';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal as AntdModal, Message } from 'antd';

const Modal = forwardRef((props, ref) => {
    const { content, width, cancelText, bodyStyle = {}, ok, onRefresh, cancel, button } = props;
    let { maskClosable = false, closable = true, title, footer, inlineBlock, hiddenFunc } = props;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const inlineBlockStyle = { display: 'inline-block' };
    if (hiddenFunc) {//隐藏底部按钮函数
        footer = hiddenFunc(footer, content);
    }

    const funcOk = ({ form, isEdit, idToEdit, onSave, extraDeal }) => {
        //extraDeal数据加工，如判重
        form.validateFields()
            .then((values) => {
                try {
                    setConfirmLoading(true);
                    if (extraDeal) extraDeal(values)
                    onSave(isEdit, values, idToEdit).then((res) => {
                        if (res) {
                            let err = (res.payload || {}).error;
                            if (!err) {
                                form.resetFields();
                            }
                        } else {
                            form.resetFields();
                        }
                        setConfirmLoading(false);
                        handleCancel()
                        if (onRefresh) {
                            onRefresh();
                        }
                    });
                } catch (err) {
                    console.log(err)
                    //可throw `错误信息`
                    Message.error(err);
                    setConfirmLoading(false);
                }
            })
    }
    // const func = {
    //     handleOk: function ({ form, isEdit, idToEdit, onSave, extraDeal }) {
    //         return new Promise((resolve, reject) => {
    //             form.validateFields()
    //                 .then((values) => {
    //                     extraDeal(values)
    //                     onSave(isEdit, values, idToEdit).then((res) => {
    //                         if (res) {
    //                             let err = (res.payload || {}).error;
    //                             if (!err) {
    //                                 form.resetFields();
    //                             }
    //                         } else {
    //                             form.resetFields();
    //                         }

    //                         resolve(true);
    //                     });
    //                 })
    //                 .catch((info) => {
    //                     reject(false);
    //                     console.log('Validate Failed:', info);
    //                 });
    //         });
    //     }
    // }
    const handleOk = (e) => {
        if (ok) {
            ok()
            // try {
            //     // 涉及到异步方法时，需要包装成promise。暂不支持dispatch方法
            //     const res = ok().then(re => console.log(re));
            //     console.log(res);
            //     handleCancel()
            //     setConfirmLoading(false);
            //     if (onRefresh) {
            //         onRefresh();
            //     }
            // } catch (e) {
            //     console.log(e);
            //     setConfirmLoading(false);
            // }
        } else {
            handleCancel()
            setConfirmLoading(false);
        }
    };
    const handleCancel = (e) => {
        if (cancel) {
            cancel();
        }
        if (button)
            setVisible(false);

    };
    useImperativeHandle(ref, () => ({
        funcOk
    }))
    return (
        <div style={inlineBlock ? inlineBlockStyle : {}} >
            {button ? <div onClick={() => { setVisible(true) }}>{button}</div> : ''}
            <AntdModal
                centered
                title={title}
                bodyStyle={{ maxHeight: window.innerHeight - 300, overflowY: 'auto', ...bodyStyle }}
                visible={button ? visible : props.visible}
                confirmLoading={confirmLoading}
                width={width}
                destroyOnClose={true}
                cancelText={cancelText}
                footer={footer}
                closable={closable}
                maskClosable={maskClosable}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {content}
            </AntdModal>
        </div>
    );
})

export default Modal;
