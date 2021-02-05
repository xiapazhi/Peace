/**
 * Created by liu.xinyi
 * on 2016/5/10.
 */
'use strict';

export const Red = '#E01515';

export const Orange = '#FF6100';

export const Purple = '#5E30B5';

export const Blue = '#00A0E8';

export const Green = '#60BE29';

export function getAlarmLevelColors(){
    return [Red,Orange,Purple,Blue,Green];
}

export function pickColorWithAlarmLevel(level) {
    switch (level) {
        case 1:
            return Red;
        case 2:
            return Orange;
        case 3:
            return Purple;
        case 4:
            return Blue;
        case 5:
            return Green;
        default:
            return '#c8c8c8';
    }
}

export function pickColorWithStatus(status) {
    switch (status) {
        case '差':
            return Red;
        case '劣':
            return Orange;
        case '中':
            return Purple;
        case '良':
            return Blue;
        case '优':
            return Green;
        default:
            return '#c8c8c8';
    }
}

export const Red_Light = 'rgba(255, 0, 0, 0.1)';
export const Orange_Light = 'rgba(255, 165, 0, 0.1)';
export const Purple_Light = '#E6E6FA';
export const Blue_Light = '#F0FFFF';

export function pickColorWithThreshold(level) {
    switch (level) {
        case 1:
            return Red_Light;
        case 2:
            return Orange_Light;
        case 3:
            return Purple_Light;
        case 4:
            return Blue_Light;
        default:
            return '#c8c8c8';
    }
}