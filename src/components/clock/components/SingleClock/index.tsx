import React, {useContext} from 'react'
import {TimeContext} from "../../context.tsx";
import getTheme, {getContainerShadow, getPinShadow} from '../../theme.ts'
import styles from './style.module.scss'

interface Props {
    pos?: { part: number, x: number, y: number, partIndex: number },
    diameter?: number;
    min?: number;
    hour?: number;
    darkMode?: boolean;
    duration?: number
    lightingAngle?: number;
}


const SingleClock: React.FC<Props> = (props) => {
    const {
        pos,
        diameter = 300,
        min: pMin = 0,
        hour: pHour = 0,
        darkMode: pDarkMode = false,
        lightingAngle: pLightAngle = 0,
        duration: pDuration = 3
    } = props;

    const {getProps} = useContext(TimeContext)
    const {
        lightingAngle = pLightAngle,
        min = pMin,
        hour = pHour,
        darkMode = pDarkMode,
        duration = pDuration
    } = getProps?.(pos) || {}

    const {pin} = getTheme(darkMode, lightingAngle);

    const containerStyle: React.CSSProperties = {
        width: diameter,
        height: diameter,
        boxShadow: getContainerShadow(lightingAngle, diameter),
        transition: `box-shadow ${duration}s ease-in-out`,
    }
    const pinWidth = diameter / 15
    const pinHeight = diameter / 2 - pinWidth
    const commonStyle = {
        width: pinWidth,
        height: pinHeight,
        borderRadius: pinWidth,
        background: pin,
        transformOrigin: `${pinWidth / 2}px ${pinHeight - pinWidth / 2}px`,
        left: diameter / 2 - pinWidth / 2,
        top: diameter / 2 + pinWidth / 2 - pinHeight,
        transition: `transform ${duration}s ease-in-out, box-shadow ${duration}s ease-in-out`,
    }
    const minuteStyle: React.CSSProperties = {
        transform: `rotate(${min}deg)`,
        boxShadow: getPinShadow(lightingAngle, min),
        ...commonStyle
    }
    const hourStyle: React.CSSProperties = {
        transform: `rotate(${hour}deg)`,
        boxShadow: getPinShadow(lightingAngle, hour),
        ...commonStyle
    }
    return <div className={styles['single-clock']} style={containerStyle}>
        <div className={styles['minute']} style={minuteStyle}></div>
        <div className={styles['hour']} style={hourStyle}></div>
    </div>
}

export default SingleClock