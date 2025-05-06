export default (darkMode: boolean, lightingAngle: number = 0) => {
    return {
        pin: darkMode ? `linear-gradient(${lightingAngle + 180}deg, #ffffff, #dddddd)` : `linear-gradient(${lightingAngle + 180}deg, #282828, #212121)`,
    }
}

export function getContainerShadow(lightAngle: number, diameter: number): string {
    const x = Math.round(-Math.sin(lightAngle * Math.PI / 180) * 100) / 100;
    const y = Math.round(Math.sin((lightAngle + 90) * Math.PI / 180) * 100) / 100;
    const distant = diameter / 20;
    const blur = diameter / 20;
    const darkShadow = 'rgba(0, 0, 0, 0.25)';
    const lightShadow = 'rgba(255, 255, 255, 0.1)';
    return `inset ${x * distant}px ${y * distant}px ${blur}px ${darkShadow}, inset ${-x * distant}px ${-y * distant}px ${blur}px ${lightShadow}`;
}

export function getPinShadow(lightAngle: number, pinAngle: number): string {
    const x = Math.round(-Math.sin((pinAngle - lightAngle) * Math.PI / 180) * 100) / 100;
    const y = Math.round(Math.sin((pinAngle - lightAngle + 90) * Math.PI / 180) * 100) / 100;
    const distant = 3;
    const darkShadow = 'rgba(0,0,0,0.3)'
    return `${-x * distant}px ${y * distant}px 5px ${darkShadow}`;
}
