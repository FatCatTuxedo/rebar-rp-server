import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
const Rebar = useRebar();

alt.onClient("healthChange", async (player, health) => {
    player.setStreamSyncedMeta("nametag_c", "red");
    await alt.Utils.wait(250);
    player.setStreamSyncedMeta("nametag_c", "white");
});