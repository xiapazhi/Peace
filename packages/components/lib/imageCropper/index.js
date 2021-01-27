import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Cropper from "react-cropper";
import './style.less'

const ImageCropper = (props) => {
    const { title, visible, handleCancel, handleCropperOk, originalImage } = props;

    const [image, setImage] = useState(originalImage);
    const [cropper, setCropper] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (originalImage) {
            setImage(originalImage)
        }
    }, [originalImage])

    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        let file = files[0]
        const extNames = file.name.split('.');
        let isImg = false;
        if (extNames.length > 0) {
            isImg = ['jpg', 'png', 'svg'].includes(extNames[extNames.length - 1].toLowerCase());
        }
        if (!isImg) {
            message.error('只能上传jpg、svg或者png格式图片!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('文件必须小于2MB!');
            return false;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const submit = () => {
        const dataUrl = cropper.getCroppedCanvas().toDataURL('image/png')
        let arr = dataUrl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let blob = new Blob([u8arr], { type: mime });
        let fileData = new FormData();
        fileData.append('image', blob, "image.png");
        handleCropperOk(fileData)
        setLoading(true)
    }

    return (
        <Modal
            maskClosable={false}
            title={title || "上传图片"}
            visible={visible}
            onOk={submit}
            onCancel={() => {
                setLoading(true)
                handleCancel()
            }}
            width='50%'
            destroyOnClose
        >
            <Spin spinning={loading}>
                <div style={{ position: 'relative' }}>
                    <Button icon={<UploadOutlined />} style={{
                        marginBottom: 16
                    }}>上传图片</Button>
                    <input type="file" onChange={onChange} style={{
                        width: 100,
                        opacity: 0,
                        position: 'absolute',
                        left: 0
                    }} />

                    <Cropper
                        aspectRatio={16 / 9}
                        style={{ height: 400, width: "100%" }}
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        ready={() => {
                            setLoading(false)
                        }}
                        onInitialized={(instance) => {
                            setCropper(instance);
                        }}
                    />
                </div>
            </Spin>
            <span>
                文件格式：只能上传jpg、svg或者png格式图片<br />
                文件大小：文件必须小于2MB
            </span>
        </Modal>
    )
}

export default ImageCropper;