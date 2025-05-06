import React, {JSX, useEffect, useRef, useState} from 'react'

interface Props {
    direction?: 'horizontal' | 'vertical'
    width: number
    height: number
    renderItem: (pos: {
        part: number,
        x: number,
        y: number,
        partIndex: number
    }, diameter: number, key: string) => JSX.Element
}

const getPos = (direction: 'horizontal' | 'vertical', index: number): { part: number, x: number, y: number } => {
    const rowCount = direction === 'vertical' ? 8 : 16;
    const rowBias = direction === 'vertical' ? 4 : 8;
    const colBias = direction === 'vertical' ? 6 : 3;
    const x = index % rowCount - rowBias >= 0 ? index % rowCount - rowBias + 1 : index % rowCount - rowBias;
    const y = colBias - Math.floor(index / rowCount) <= 0 ? colBias - Math.floor(index / rowCount) - 1 : colBias - Math.floor(index / rowCount);
    const part = direction === 'vertical' ? [2, 4, 1, 3][Number(index % rowCount - rowBias < 0) << 1 | Number(y < 0)] : Math.floor((index % rowCount - rowBias + 8) / 4) + 1;
    return {
        part: part,
        x: x,
        y: y
    }
}

const Layout: React.FC<Props> = (props) => {
    const {direction = 'vertical', width, height, renderItem} = props;
    const [diameter, setDiameter] = useState<number>(0)
    const gridRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (gridRef.current && width && height) {
            let diameter
            if (direction === 'vertical') {
                diameter = Math.min(height / 12, width / 8)
            } else if (direction === 'horizontal') {
                diameter = Math.min(width / 16, height / 6)
            } else {
                diameter = gridRef.current.clientWidth / (direction === 'vertical' ? 8 : 16)
            }
            setDiameter(Math.floor(diameter))
        }
    }, [direction, width, height])

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${direction === 'vertical' ? 8 : 16}, 1fr)`,
    }

    const partIndex = [-1, -1, -1, -1]

    return <div ref={gridRef} style={gridStyle}>
        {Array.from({length: 96}, (_, index) => {
            const pos = getPos(direction, index)
            partIndex[pos.part - 1] += 1;
            return renderItem({...pos, partIndex: partIndex[pos.part - 1]}, diameter, `${pos.x}${pos.y}${index}`)
        })}
    </div>
}

export default Layout