import MatrixClock from "@/components/clock";
import {useEffect, useRef, useState} from "react";

export default function Home() {
    const [direction, setDirection] = useState<"horizontal" | "vertical" | undefined>(undefined);
    const [darkMode, setDarkMode] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;
                const height = containerRef.current.clientHeight;
                const direction = width > height ? 'horizontal' : 'vertical'
                setDirection(direction)
                setWidth(width)
                setHeight(height)
            }
        })
        let observerRefValue = null
        if (containerRef.current) {
            observer.observe(containerRef.current)
            observerRefValue = containerRef.current
        }
        return () => {
            if (observerRefValue) {
                observer.unobserve(observerRefValue)
            }
        }
    }, [])
    useEffect(() => {
        const mqList = window.matchMedia('(prefers-color-scheme: dark)');

        setDarkMode(mqList.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setDarkMode(true)
            } else {
                setDarkMode(false)
            }
        }

        mqList.addEventListener('change', handleChange);
        return () => {
            mqList.removeEventListener('change', handleChange);
        }
    }, []);
    const containerStyle = {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    }
    const debounceDirection = useDebounce(direction, 200)
    const debounceWidth = useDebounce(width, 200)
    const debounceHeight = useDebounce(height, 200)

    return (
        <div ref={containerRef} style={containerStyle}>
            {debounceDirection ? <MatrixClock direction={debounceDirection} darkMode={darkMode} width={debounceWidth}
                                              height={debounceHeight}/> : null}
        </div>
    );
}

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timeout if the value or delay changes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
