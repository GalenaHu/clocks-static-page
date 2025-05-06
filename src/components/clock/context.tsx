import React, {createContext, useCallback, useEffect, useState} from 'react';
import getPinByTime, {getPinByRandom} from "./components/MatrixClock/shape.ts";

type GetProps = (pos?: { part: number, x: number, y: number, partIndex: number }) => {
    min?: number;
    hour?: number;
    darkMode?: boolean;
    duration?: number;
    lightingAngle?: number;
}

const TimeContext = createContext<{ getProps?: GetProps }>({})

const recursionSetTimeout = (callback: (isDone: boolean) => void, times: number, duration: number) => {
    let t = times - 1
    callback(false)
    if (t >= 0) {
        const timer = setTimeout(() => {
            clearTimeout(timer)
            callback(false)
            t = t - 1
            recursionSetTimeout(callback, t, duration)
        }, duration)
    } else {
        callback(true)
    }
}

const TimeContextWrapper: React.FC<{
    children: React.ReactNode,
    darkMode?: boolean,
    lightingAngle?: number,
    duration?: number,
}> = (props) => {
    const {darkMode, lightingAngle, duration = 3} = props;
    const [time, setTime] = useState<Date>(new Date());
    const [randomChanging, setRandomChange] = useState<number>(0)
    useEffect(() => {
        const times = 3;
        scheduleMinuteCallback(() => {
            recursionSetTimeout((isDone) => {
                setRandomChange(isDone ? 0 : Math.random())
                if (isDone) {
                    setTime(new Date(new Date().getTime() + duration * 1000))
                }
            }, times, duration * 1000)
        }, -times * duration)
    }, [duration]);
    const getProps = useCallback((pos?: { part: number, x: number, y: number, partIndex: number }) => {
        const {min, hour} = randomChanging !== 0 ? getPinByRandom(randomChanging, pos) : getPinByTime(time, pos)
        return {
            min,
            hour,
            darkMode,
            duration,
            lightingAngle,
        }
    }, [darkMode, lightingAngle, time, duration, randomChanging])
    return <TimeContext.Provider value={{getProps}}>{props.children}</TimeContext.Provider>
}

function scheduleMinuteCallback(
    callback: () => void,
    offsetSeconds: number = 0
) {
    const now = new Date();

    // 计算下一分钟的基准时间 (X:XX:00)
    const nextMinute = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes() + 1,  // 下一分钟
        0,                     // 0秒
        0                      // 0毫秒
    );

    // 应用偏移量
    const nextTrigger = new Date(nextMinute.getTime() + offsetSeconds * 1000);

    // 处理偏移导致时间已过的情况
    if (nextTrigger <= now) {
        nextTrigger.setMinutes(nextTrigger.getMinutes() + 1);
    }

    // 计算延迟时间
    const delay = nextTrigger.getTime() - now.getTime();

    setTimeout(() => {
        callback();
        scheduleMinuteCallback(callback, offsetSeconds); // 递归调用
    }, delay);
}

export default TimeContextWrapper
export {TimeContext}