
import React from 'react';
import moment from 'moment';
import { Search } from '@peace/components'

const LogSearch = props => {
    const { onSearch } = props

    const searchForm = [{
        field: "keywords",
        style: {
            width: 210
        }
    }, {
        type: "RANGETIME",
        field: "timeSelected",
        label: "查询时间",
        showTime: true
    }]

    return (
        <Search
            showNumber={2}
            showRest
            formList={searchForm}
            onSearch={(v) => {
                const { keywords, timeSelected } = v
                onSearch({
                    keywords: keywords,
                    startTime: timeSelected ? timeSelected[0] : undefined,
                    endTime: timeSelected ? timeSelected[1] : moment()
                })
            }}
            colSpan={{ label: 20, button: 3 }}
        />
    )
}

export default LogSearch;