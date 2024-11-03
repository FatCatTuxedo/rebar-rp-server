import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { TimeConfig } from './config.js';

import { Weathers } from '@Shared/data/weathers.js';
const Rebar = useRebar();
const timeService = Rebar.services.useTimeService();

function updateTime() {
    const time = timeService.getTime();
    
    if (TimeConfig.useServerTime) {
        const currentTime = new Date(Date.now());
        timeService.setTime(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
    } else {
        let minute = time.minute + TimeConfig.minutesPerMinute;
        let hour = time.hour;

        if (minute >= 60) {
            minute = 0;
            hour += 1;

            if (time.hour >= 24) {
                hour = 0;
            }
        }

        timeService.setTime(hour, minute, 0);
    }

    alt.log(
        `World Time - ${time.hour <= 9 ? `0${time.hour}` : time.hour}:${time.minute <= 9 ? `0${time.minute}` : time.minute}`,
    );
}

function updateAllPlayers() {
    const time = timeService.getTime();

    for (let player of alt.Player.all) {
        Rebar.player.useWorld(player).setTime(time.hour, time.minute, 0);
    }
}

function handleUpdateTime(player: alt.Player) {
    const time = timeService.getTime();
    Rebar.player.useWorld(player).setTime(time.hour, time.minute, 0);
}

const weatherService = Rebar.services.useWeatherService();

let weatherIndex = 0;

function updatePlayerWeather(player: alt.Player, weatherType: Weathers) {
    Rebar.player.useWorld(player).setWeather(weatherType, TimeConfig.timeToTransition);
}

function updateWeather() {
    weatherIndex += 1;

    const weathers = weatherService.getWeatherForecast();
    if (weatherIndex >= weathers.length) {
        weatherIndex = 0;
    }

    weatherService.setWeather(weathers[weatherIndex]);
}

function handleWeatherChange(weather: Weathers) {
    for (let player of alt.Player.all) {
        if (!Rebar.player.useStatus(player).hasCharacter()) {
            continue;
        }

        updatePlayerWeather(player, weather);
    }

    alt.log(`Weather is now: ${weather}`);
}

function handleUpdateWeather(player: alt.Player) {
    updatePlayerWeather(player, weatherService.getWeather());
}

updateTime();
alt.setInterval(updateTime, 60000);
alt.on('rebar:timeChanged', updateAllPlayers);
alt.on('playerConnect', handleUpdateTime);
weatherService.setWeatherForecast(TimeConfig.weathers);
alt.on('playerConnect', handleUpdateWeather);
alt.on('rebar:weatherChanged', handleWeatherChange);
alt.setInterval(updateWeather, TimeConfig.timeBetweenUpdates);
