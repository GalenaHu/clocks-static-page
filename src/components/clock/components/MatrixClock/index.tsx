import React, {useCallback} from 'react'
import TimeContextWrapper from "../../context.tsx";
import Layout from './Layout.tsx'
import SingleClock from '../SingleClock/index.tsx'

interface Props {
    darkMode?: boolean
    direction?: 'horizontal' | 'vertical'
    width: number
    height: number
    duration?: number
    lightingAngle?: number;
}

const MatrixClock: React.FC<Props> = (props) => {
    const {direction = 'vertical', width, height, darkMode, duration, lightingAngle} = props
    const renderItem = useCallback(
        (pos: { x: number; y: number; part: number, partIndex: number }, diameter: number, key: string) => {
            return <SingleClock key={key} pos={pos} diameter={diameter}/>
        }, [])
    return <>
        <TimeContextWrapper darkMode={darkMode} lightingAngle={lightingAngle} duration={duration}>
            <Layout direction={direction} width={width} height={height} renderItem={renderItem}>
            </Layout>
        </TimeContextWrapper>
    </>
}

export default MatrixClock