'use strict';

import Func from './src/func'
import * as WebAPI from './src/webapi'
import { PinyinHelper } from './src/pinyin'
import ActionHelper from './src/actionHelper'
import ReducerHelper from './src/reducerHelper'
import Constans from './src/constans'
import Region from './src/region'
import { sort } from './src/smartSort'
import * as Colors from './src/colors'

export { Func, WebAPI, PinyinHelper, ActionHelper, ReducerHelper, Constans, Region as region, sort, Colors }

import { buildUrl, buildRoute, Request, RouteRequest } from './src/webapi'
export { buildUrl, buildRoute, Request, RouteRequest }

import { clearData, httpGet, httpPost, httpPut, httpDel, basicAction } from './src/actionHelper'
export { clearData, httpGet, httpPost, httpPut, httpDel, basicAction }

import { basicReducer } from './src/reducerHelper'
export { basicReducer }