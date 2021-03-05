'use strict';
import React, { useRef, forwardRef } from 'react';
import {
    Form as AntdForm,
    Input,
    InputNumber,
    Select,
    Switch,
    Radio,
    Cascader,
    DatePicker,
    Upload,
    Button,
    Collapse,
    Row,
    TreeSelect,
    message,
    Tooltip,
    Transfer,
    Space,
    Checkbox
} from 'antd';
import moment from 'moment';
import { Constans, Func } from '@peace/utils';
import { UploadOutlined, DownloadOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './index.less';

const { RangePicker } = DatePicker;
const TextArea = Input.TextArea;
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;

const Form = forwardRef((props, ref) => {
    const { dataToEdit, popupContainerId } = props;
    const [form] = AntdForm.useForm();
    const currentUploadFileListRef = useRef(dataToEdit && dataToEdit.attachmentSrcs ? dataToEdit.attachmentSrcs : []); // 不能用useState 会导致数据更新不及时

    let hubUrl = [];
    //提交表单且数据验证成功后回调事件
    const onFinish = (values) => {
        console.log('finish:' + values);
    };
    //文件上传限制
    const handleBeforeUpload = (file, onlyImg) => {
        const filename = file.name;
        const blacklistExts = ['php', 'js', 'html', 'htm', 'shtml', 'shtm'];
        const current = currentUploadFileListRef.current;
        const maxFileSize = 10;
        const maxFileNum = 10;
        const ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();

        // 文件的扩展名不能在黑名单里
        if (blacklistExts.indexOf(ext) > -1) {
            message.error('上传的文件不合法，请重新上传');
            return false;
        }

        // 文件数量不能超出最大限制
        if (currentUploadFileListRef.current.length + current.length > maxFileNum) {
            message.error('上传文件超出最大限制');
            return false;
        }
        // 文件大小不能超过配置
        if (file.size > maxFileSize * 1024 * 1024) {
            message.error(file.name + '超出文件大小最大限制:' + maxFileSize + 'M');
            return false;
        }
        return true;
    };
    //附件上传变化事件
    const fileOnChange = (info) => {
        const maxFileSize = 10;
        let fileList = info.fileList;
        let file = info.file;
        const filename = file.name;
        const maxFileNum = 10;

        fileList.map((item) => {
            if (item.status == 'done' && item.url == '') {
                item.status = 'error';
            }
        });

        const blacklistExts = ['php', 'js', 'html', 'htm', 'shtml', 'shtm'];
        const ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
        if (info.file.status === 'error' || (info.file.response === '' && info.file.status !== 'removed')) {
            message.error(info.file.name + '上传失败，请稍后重试.');
        }
        // 文件数量不能超出最大限制
        // 文件大小不能超过配置
        // 文件扩展名不能在黑名单里
        if (fileList.length > maxFileNum || file.size > maxFileSize * 1024 * 1024 || blacklistExts.indexOf(ext) > -1) {
            currentUploadFileListRef.current = currentUploadFileListRef.current;
        } else {
            currentUploadFileListRef.current = fileList;
        }
    };
    ///附件删除
    const onRemove = (file) => {
        deleteFile(file);
        const filterFileList = currentUploadFileListRef.current.filter((fileItem) => {
            return file.uid !== fileItem.uid;
        });
        currentUploadFileListRef.current = filterFileList;
        file = Object.assign({}, file, {
            url: file.response,
            status: 'removed'
        });
        const info = { file: file, fileList: filterFileList };
        fileOnChange(info);
    };
    //删除图片文件
    const deleteFile = (file) => {
        const { customUploadRequest, options } = props;
        if (file.url ? file.url : file.response) {
            customUploadRequest(file, 'delete');
        }
    };
    // 示例图片、上传图片预览
    const handleImageView = (url) => {
        if (typeof url !== 'string') {
            return;
        }
        window.open(url);
    };
    //下载
    const onDownload = (previewFile) => {
        let url;
        currentUploadFileListRef.current.map((file) => {
            if (file.uid === previewFile.uid) {
                url = file.url ? file.url : file.response;
            }
        });
        handleImageView(url);
    };

    const _getUrlFormHub = (file) => {
        let result = '';
        const uid = file.uid;
        hubUrl.map((hubItem) => {
            if (hubItem.uid === uid) {
                result = hubItem.url;
            }
        });
        return result;
    };

    const _customRequest = (option) => {
        const { customUploadRequest, options } = props;
        const { uploadType } = options;
        if (currentUploadFileListRef.current.length > 0) {
            currentUploadFileListRef.current.filter((item) => {
                if (item.name == option.file.name) {
                    message.warning('提示：已存在同名同类型文件！');
                }
            });
        }
        // 是否指定了自定义上传，如果没有则使用内置的OSS上传
        if (typeof customUploadRequest === 'function') {
            customUploadRequest(
                option.file,
                'upload',
                uploadType,
                (url) => {
                    const time = moment().format('HHmmss');
                    let fieldFormData;
                    hubUrl = hubUrl.filter((item) => {
                        return item.uid !== option.file.uid;
                    });
                    hubUrl.push({
                        name: option.file.name,
                        uid: option.file.uid,
                        url
                    });
                    fieldFormData = currentUploadFileListRef.current.map((file) => {
                        const status = _getUrlFormHub(file) ? file.status : 'error';
                        return {
                            name: file.name,
                            uid: file.uid,
                            status,
                            url: _getUrlFormHub(file)
                        };
                    });
                    currentUploadFileListRef.current = fieldFormData;
                    // 这个会将传入的值放到Upload组件的file.response里面
                    option.onSuccess(url);
                    const info = {
                        file: option.file,
                        fileList: currentUploadFileListRef.current
                    };
                    fileOnChange(info);
                },
                (e) => {
                    option.onError(e);
                }
            );
        } else {
            console.warn(
                '[xform]: customUploadRequest props need to be configured before using image/file upload. For more detail, please see customUpload props in Upload component in ant design project'
            );
        }
    };

    const isHidden = (val, showVal) => {
        if (val === undefined || val === null) {
            return true;
        } else if (val === showVal) {
            return false;
        } else {
            return true;
        }
    };

    const renderFormItem = (type, opts) => {
        const {
            id,
            label,
            formItemLayout,
            rules,
            popupContainerId,
            placeholder,
            optionsSrc,
            itemProps,
            containerProps,
            widthL,
            fontSize,
            color,
            value,
            isShowName,
            isShowValue
        } = opts;
        let fn = {
            formSpan: function () {
                return (
                    <AntdForm.Item key={id} label={label} {...formItemLayout} {...containerProps}>
                        {
                            <span {...itemProps} style={{ width: widthL, fontSize: fontSize, color: color }}>
                                {value}
                            </span>
                        }
                    </AntdForm.Item>
                );
            },
            formInput: function () {
                return (
                    <AntdForm.Item
                        name={id}
                        key={id}
                        label={label}
                        rules={isShowName && isShowValue && isHidden(form.getFieldValue(isShowName), isShowValue) ? [] : rules}
                        {...formItemLayout}
                        {...containerProps}
                        hidden={isShowName && isShowValue && isHidden(form.getFieldValue(isShowName), isShowValue)}
                    >
                        <Input {...itemProps} />
                    </AntdForm.Item>
                );
            },
            formPassword: function () {
                return (
                    <AntdForm.Item name={id} key={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <Input.Password {...itemProps} />
                    </AntdForm.Item>
                );
            },

            formInputNumber: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <InputNumber {...itemProps} style={{ width: '100%' }} />
                    </AntdForm.Item>
                );
            },
            formText: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <TextArea {...itemProps} />
                    </AntdForm.Item>
                );
            },
            formCheckbox: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <Checkbox  {...itemProps} />
                    </AntdForm.Item>
                );
            },
            formSelect: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <Select
                            getPopupContainer
                            placeholder={`请选择${placeholder}`}
                            allowClear
                            showSearch
                            optionFilterProp='children'
                            filterOption={(input, option) => Func.selectFilterOption(input, option)}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            {...itemProps}
                        >
                            {optionsSrc.map((item) => (
                                <Select.Option key={item.id} value={item.id} disabled={item.disabled}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </AntdForm.Item >
                );
            },
            formTreeSelect: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            //value={this.state.value}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder={placeholder}
                            allowClear
                            treeNodeFilterProp='title'
                            // filterTreeNode={(input, node) => {
                            //     let v = input.toLowerCase();
                            //     // let src = node.props.children.toLowerCase();
                            //     // return src.includes(v) || PinyinHelper.isPinyinMatched(src, v);
                            // }} 考虑到性能暂不支持拼音
                            getPopupContainer={() => document.getElementById(popupContainerId)}
                            treeData={optionsSrc}
                            {...itemProps}
                        //treeDefaultExpandAll
                        //onChange={this.onChange}
                        />
                    </AntdForm.Item>
                );
            },

            formRadio: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <RadioGroup {...itemProps}>
                            {optionsSrc &&
                                optionsSrc.map((item) => (
                                    <Radio key={item.id} value={item.id}>
                                        {item.name}
                                    </Radio>
                                ))}
                        </RadioGroup>
                    </AntdForm.Item>
                );
            },

            formCascader: function () {
                function getCascaderNodesData(nodes) {
                    let options = nodes.map((node) => {
                        const { value, label, children, disabled } = node;
                        let item = {
                            value: `${value}`,
                            label: label.length > 10 ? `${label.slice(0, 10)}...` : label
                        };
                        if (disabled) item['disabled'] = disabled;
                        if (children) {
                            let cdata = getCascaderNodesData(children);
                            item['children'] = cdata;
                        }
                        return item;
                    });
                    return options;
                }

                let options = getCascaderNodesData(optionsSrc);
                // let options = optionsSrc

                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <Cascader
                            placeholder={placeholder}
                            options={options}
                            getPopupContainer={() => document.getElementById(popupContainerId)}
                            {...itemProps}
                        />
                    </AntdForm.Item>
                );
            },
            formDatePicker: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <DatePicker {...itemProps} />
                    </AntdForm.Item>
                )
            },
            formRangePicker: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout} {...containerProps}>
                        <RangePicker {...itemProps} />
                    </AntdForm.Item>
                );
            },

            formUpload: function () {
                let showDownload = {
                    showDownloadIcon: true,
                    downloadIcon: <DownloadOutlined />
                };
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules} {...formItemLayout}>
                        <Upload
                            multiple
                            withCredentials
                            className='upload-list-inline'
                            name={id}
                            fileList={currentUploadFileListRef.current}
                            customRequest={_customRequest}
                            beforeUpload={(file) => handleBeforeUpload(file, !opts.uploadPath || opts.uploadPath == 'image')}
                            onChange={(info) => fileOnChange(info)}
                            onRemove={(file) => onRemove(file)}
                            onDownload={(file) => onDownload(file)}
                            onPreview={(file) => onDownload(file)}
                            showUploadList={showDownload}
                            {...itemProps}
                        >
                            {opts.maxLength != null && currentUploadFileListRef.current.length >= opts.maxLength ? null : (
                                <Tooltip placement='top' title='ctrl/command键可批量上传'>
                                    <Button>
                                        <UploadOutlined /> 点击上传
                                    </Button>
                                </Tooltip>
                            )}
                        </Upload>
                    </AntdForm.Item>
                );
            },

            formCollapse: function () {
                return (
                    <Collapse {...props} key={id}>
                        {optionsSrc &&
                            optionsSrc.map((item) => {
                                return (
                                    <Panel {...item.props}>
                                        {item.children &&
                                            item.children.map((opts) => {
                                                return renderForm(opts);
                                            })}
                                    </Panel>
                                );
                            })}
                    </Collapse>
                );
            },

            formTable: function () {
                return (
                    <Row key={id}>
                        <hr />
                        <span
                            style={{
                                display: 'inline-block',
                                width: '130px',
                                height: '20px',
                                backgroundColor: 'white',
                                position: 'absolute',
                                top: '-4px',
                                textAlign: 'center',
                                left: '40%'
                            }}
                        >
                            <span>{props && props.tiptitle}</span>
                        </span>
                        <div style={{ marginTop: 8 }}>{optionsSrc}</div>
                    </Row>
                );
            },
            formSwitch: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules}{...formItemLayout} {...containerProps}>
                        {
                            <Switch {...itemProps} />
                        }
                    </AntdForm.Item>)
            },
            formTransfer: function () {
                return (
                    <AntdForm.Item key={id} name={id} label={label} rules={rules}{...formItemLayout} {...containerProps}>
                        {
                            <Transfer {...itemProps} />
                        }
                    </AntdForm.Item>)
            },
            formCustom: function () {
                return (
                    <AntdForm.Item key={id} label={label} rules={rules} {...formItemLayout} {...containerProps} >
                        {
                            opts.itemChildren && opts.itemChildren.map(item => {
                                const { type } = item;
                                return renderFormItem(type, item)
                            })
                        }
                    </AntdForm.Item>)
            },
            //单个表单项动态增减
            formDynamic: function () {
                const { formItemLayout, maxNum = 10 } = opts.itemChildren
                return (
                    <AntdForm.List key={`dynamic-${id}`} name={id} rules={rules}  {...containerProps} >
                        {(fields, { add, remove }, { errors }) => (
                            <div>
                                {fields.map((field, index) => (
                                    <AntdForm.Item
                                        {...formItemLayout}
                                        required={false}
                                        key={field.key}
                                    >
                                        <Space>
                                            <AntdForm.Item
                                                {...field}
                                                {...formItemLayout}
                                                key={`${field.key}-index`}
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={opts.itemChildren.rules}
                                                noStyle
                                            >
                                                {opts.itemChildren.component}
                                            </AntdForm.Item>
                                            {
                                                index === 0 ? <Button
                                                    type="primary"
                                                    onClick={() => { if (fields.length > maxNum) { message.warning(`数量超过上限`) } else add() }}
                                                    icon={<PlusOutlined />}
                                                /> : null}
                                            {
                                                index !== 0 && fields.length > 1 ? (
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => remove(field.name)}
                                                        icon={<MinusOutlined />}
                                                    />
                                                ) : null
                                            }
                                        </Space>
                                    </AntdForm.Item>
                                ))}
                                <AntdForm.Item>
                                    <AntdForm.ErrorList errors={errors} />
                                </AntdForm.Item>
                            </div>
                        )
                        }
                    </AntdForm.List >
                )
            }
        };

        return fn[`form${type}`]();
    };

    const renderForm = () => {
        const { formItems, formItemLayout, popupContainerId } = props;

        let pcid = popupContainerId || 'form-container';

        return formItems.map((formItem) => {
            const {
                isShowName,
                isShowValue,
                type,
                id,
                label,
                rules,
                itemProps,
                placeholder,
                optionsSrc,
                containerProps,
                maxLength,
                uploadPath,
                widthL,
                fontSize,
                color,
                value,
                itemChildren,
            } = formItem;
            let opts = {
                id,
                label,
                formItemLayout: formItemLayout || {
                    labelCol: { span: 5 },
                    wrapperCol: { span: 17 }
                },
                rules: rules || [],
                itemProps: itemProps || {},
                popupContainerId: pcid,
                placeholder: placeholder || label,
                optionsSrc: optionsSrc || {},
                containerProps: containerProps || {},
                widthL: widthL || '100%',
                fontSize: fontSize || 14,
                color: color || '#666666',
                value: value || '',
                isShowName: isShowName || '',
                isShowValue: isShowValue || '',
                itemChildren: itemChildren || []
            };
            if (type == 'Upload') {
                opts.maxLength = maxLength;
                opts.uploadPath = uploadPath;
            }
            return renderFormItem(type, opts);
        });
    };

    return (
        <AntdForm
            layout='horizontal'
            scrollToFirstError
            ref={ref}
            form={form}
            id={popupContainerId || 'form-container'}
            name={popupContainerId || 'form-container'}
            validateMessages={Constans.defaultValidateMessages}
            initialValues={dataToEdit || {}}
            onFinish={onFinish}
        >
            {renderForm}
        </AntdForm>
    );
});

export default Form;
