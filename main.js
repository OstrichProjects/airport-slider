function hsvToRgb(h, s, v){
    let r, g, b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return `rgb(${Math.floor(255*r)},${Math.floor(255*g)},${Math.floor(255*b)})`;
}


function deg2rad(deg) { return deg * (Math.PI/180) }
function getDistance(lat1, lon1, lat2, lon2) {
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1); 
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
}

const elements = ['music', 'random', 'airport', 'indicator'].reduce((acc, k) => Object.assign(acc, {[k]: document.getElementById(k)}), {});
const setVolume = (volume) => {
    if (!volume && volume !== 0) return;
    elements.music.volume = volume;
    elements.indicator.style.width = `${Math.floor(volume*100)}%`;
    document.body.style.backgroundColor = hsvToRgb(volume, 1, 0.3);
};
const randomAirport = ((airports) => {
    const r = airports[Math.floor(Math.random()*airports.length)];
    return {
        airport: r[0],
        latitude: r[1],
        longitude: r[2],
    };
})(window.airports);
elements.random.innerHTML = randomAirport.airport;
elements.airport.focus();
setVolume(0.7);
const distances = ((airports, r) => {
    return airports
        .map((a) => [a[0], getDistance(r.latitude, r.longitude, a[1], a[2])])
        .sort((a, b) => a[1] - b[1])
        .map((a, i) => [a[0], i/(airports.length-1)])
        .reduce((acc, a) => Object.assign(acc, {[a[0]]: a[1]}), {});
})(window.airports, randomAirport);

elements.airport.addEventListener('keyup', () => {
    setVolume(distances[elements.airport.innerText.toUpperCase()]);
});