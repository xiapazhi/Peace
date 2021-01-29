### form--表单组件

参数设置：

 - popupContainerId -- 表单id名，string
 - dataToEdit -- 表单默认值，object
 - formItems, object
    - isShowName、isShowValue  两值相同时，隐藏字段
   - type 字段类型 [Span、Input、Password、InputNumber、Text、Select、TreeSelect、Radio、Cascader、RangePicker、Upload、Collapse、Table]
   - id
   - label -- 标签的文本
   - rules --校验规则 
   - itemProps -- item属性 {maxLength:18}
   - placeholder
   - optionsSrc -- 数据源 [{id:1,name:"one"},{id:2,name:"two"}]
   - maxLength -- 附件个数最大值
   - uploadPath -- 附件类型，暂未做过滤
   - widthL -- 宽度
   - fontSize
   - color
   - value
   - formItemLayout，object

示例：

```
import React, { useRef, useState } from 'react'
import { Form } from '@peace/components'

...
	const _formRef = useRef(null)
	 const formItems = [
        {
            type: "Input",
            id: "name",
            label: "名称",
            rules: [{ required: true, whitespace: true }],
            itemProps: { maxLength: 18 },
        },
        {
            type: "TreeSelect",
            id: "department",
            label: "所在部门",
            optionsSrc: departmentOptions || [],
            rules: [{ required: true }],
        },
    ]
	<Form
        ref={_formRef}
        formItems={formItems}
        formItemLayout={{ labelCol: { span: 6 }, wrapperCol: { span: 17 } }}
        popupContainerId="controller-set-form"
        dataToEdit={dataToEdit}
    />
```

### modal--弹出框组件

参数设置：

 - content -- 展示内容
 - title 
 - width
 - cancelText
 - closable
 - maskClosable
 - button -- 弹框按钮，<a style={{ color: 'rgba(66,122,242,1)' }}>修改</a>；为false时，需传visible值
 - bodyStyle  -- body样式 [{padding: '30px'}]
 - footer -- 底部内容
 - inlineBlock -- block样式设置，bool
 - ok --点击确定回调
 - cancel -- 取消回调-
 - hiddenFunc -- 隐藏底部按钮函数
 - onRefresh-- 重置func，一般设置state

示例：

```
import React, { useRef, useState } from 'react'
import {  Modal,Form } from '@peace/components'

...

<Modal
    title='标题'
    content={(
    <Form
        ref={_formRef}
        formItems={formItems}
        popupContainerId="controller-set-form"
        dataToEdit={dataToEdit}
    />
    )}
    button={<a style={{ color: 'rgba(66,122,242,1)' }}>编辑</a>}
    ok={() => handleOk(true)}
    />
```

### table--表单组件

参数设置：

 - data-- 数据资源
 - attrs -- 展示列
 - actions -- 操作栏数组
 - scroll -- 同antd 用法
 - rowSelection -- 表格行是否可选择 配置项同antd
 - onTableChange -- onChange触发函数
 - showHeader -- 是否展示表头
 - noShowPagination -- 是否展示分页器
 - showLessItems -- 是否显示较少页面内容
 - rowKey -- 表格记录的key

示例：

```

  const tableColumnAttrs = [
        { key: 'id', name: '序号', render: (text, record, index) => { return index + 1 + offset } },
        { key: 'name', name: '名称' }];
  const actions = [
        {
            key: 'edit',
            dom: <Modal
               ...
                )}
                button={<a style={{ color: 'rgba(66,122,242,1)' }}>编辑</a>}
                ok={() => handleOk(true)}
            />,
            handler: onEditClick,
        },
        {
            key: 'del',
            name: '删除',
            popconfirm: true,
            handler: onDelClick,
        },
    ];        
    <Table
        data={data}
        attrs={tableColumnAttrs}
        actions={actions}
        isRequesting={isRequesting}
        onTableChange={onTableChange}
        total={count}
        curpage={current}
        scroll={{ y: (clientHeight - 300) * 0.8 }}
        />
```

### search--查询栏组件

参数设置：

 - formList -- 配置数组 [{label, field, type[TIME,RANGETIME,SELECT,INPUT], initialValue, placeholder, width, list(select使用) optionName(select使用) , showTime(是否显示时间) }]
 - showNumber -- 默认展示几个item ，其余展开按钮控制
 - offset
 - onSearch --  查询函数
 - showRest -- 是否重置按钮

示例：

```
import { Search, Table, Form, Modal } from '@peace/components'
...
 const searchFormLists = [{ 
 		  field: 'name', 
          type: 'INPUT', 
          label: '名称', 
          labelSpan: 12, 
          placeholder: '请输入名称' }];
 <Search
     showNumber={2}
     formList={searchFormLists}
     onSearch={onSearchClick}
  />

```