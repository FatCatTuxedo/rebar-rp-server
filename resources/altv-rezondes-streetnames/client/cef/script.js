
alt.on("speedometer:Update", UpdateVehicle);

function UpdateVehicle(street, zone, dir) {
    document.getElementsByClassName('street')[0].innerHTML = street;
    document.getElementsByClassName('zone')[0].innerHTML = zone;
    document.getElementsByClassName('dir')[0].innerHTML = dir;
}