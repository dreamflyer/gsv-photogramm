export function getPanoConfig(lat: number, lng: number) {
    return {
        position: {
            lat: lat,
            lng: lng
        },

        pov: {
            heading: 0,
            pitch: 0,
            zoom: 1
        },

        //disableDefaultUI: true,

        clickToGo: false,

        imageDateControl: true
    }
}

export function getMapConfig(lat: number, lng: number): any {
    return {
        center: {
            lat: lat,
            lng: lng
        },

        scrollwheel: false,

        zoom: 18,

        draggable: false,

        imageDateControl: true
    }
}