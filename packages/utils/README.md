# `utils`

## Usage

``` 
import { Func, WebAPI, PinyinHelper, ActionHelper, ReducerHelper, Constans, region, buildUrl, buildRoute, Request, RouteRequest, clearData, httpGet, httpPost, httpPut, httpDel, basicAction, basicReducer } from '@peace/utils'

```

```
 @method clearData                    清空数据
 @param {*} dispatch  
 @param {*} opts        Object  必须
  actionType            String  必须
```

```
 @method httpGet
 @param {*} dispatch  
 @param {*} opts      Object  必须
  url                 String  必须    请求路由
  query               Object          请求参数
  actionType          String  必须
  msg                 Object          成功/失败提示信息，优先级次于接口 body.message
      success         String          成功
      error           String          失败
  callback            Function            对于返回数据预处理的回调，返回值作为 action 的 payload 的 data 即 reducer 的 data 返回（所以记得写 return 哦！）
```

```
 @method httpPost                    
 @param {*} dispatch  
 @param {*} opts      Object      必须
  url                 String      必须    请求路由
  data                Object              请求数据
  query               Object              请求参数
  actionType          String      必须
  msg                 Object              成功/失败提示信息，优先级次于接口 body.message
      success         String              成功
      error           String              失败
  callback            Function            对于返回数据预处理的回调，返回值作为 action 的 payload 的 data 即 reducer 的 data 返回（所以记得写 return 哦！）
```

```
 @method httpPut                    
 @param {*} dispatch  
 @param {*} opts      Object  必须
  url                 String  必须    请求路由
  data                Object          请求数据
  actionType          String  必须
  msg                 Object          成功/失败提示信息，优先级次于接口 body.message
      success         String          成功
      error           String          失败
  callback            Function            对于返回数据预处理的回调，返回值作为 action 的 payload 的 data 即 reducer 的 data 返回（所以记得写 return 哦！）
```

```
 @method httpDel                    
 @param {*} dispatch  
 @param {*} opts      Object  必须
  url                 String  必须    请求路由
  actionType          String  必须
  msg                 Object          成功/失败提示信息，优先级次于接口 body.message
      success         String          成功
      error           String          失败
 ```

 ```
 @method errCallback  
 @param {*} err           Object  必须    接口返回的错误信息
  body                    Object         
   message                String
 @param {*} dispatch              必须
 @param {*} actionTypes   Object  必须
 @param {*} msg           Object  必须
  error                   String  必须
 ```

 ```
 @method basicAction  
 @param {*} params     
      type                String  必须  get|post|put|del 指定类型
      dispatch                    必须
      get|post|put|del                  按 type 所需要的参数一并传递
        msg
          option          String        如若传 option ，则自动拼接为 success，error
      initReducer         Boolean       true 则自动生成 reducer()
      reducer             Object        生成 reducer() 相关参数
        name              String        指定生成 reducer() 的名称
        params            Object        见 reducerHelp/basicReducer params 参数
 ```
