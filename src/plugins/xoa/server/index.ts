
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { useApi } from '@Server/api/index.js';
const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();
const config = Rebar.useServerConfig();
async function init() {
    config.set('hideVehicleName', true);
    config.set('hideVehicleClass', true);
    config.set('hideStreetName', true);
    config.set('hideAreaName', true);
    config.set('hideMinimapInPage', true);
    config.set('disablePistolWhip', true);
    config.set('disableVehicleEngineAutoStart', true);
    config.set('disableVehicleEngineAutoStop', true);
    config.set('disableVehicleSeatSwap', true);
    config.set('disablePropKnockoff', true);
    config.set('disableAmbientNoise', true);
    config.set('disableScubaGearRemoval', true);
    config.set('disableCriticalHits', true);
    const groups = Rebar.permissions.usePermissionGroup();
    await groups.addPermissions("admin", ['admin']);
}
messenger.commands.register({
    name: '/tpwp',
    desc: '- teleport to a given waypoint',
    options: { permissions: ['admin'] },
    callback: async (player: alt.Player) => {
        const pos = await Rebar.player.useWaypoint(player).get();
        if (!pos) {
            return;
        }
        player.pos = pos;
    },
});
function listPermissions(player: alt.Player) {
    const permissions = Rebar.document.account.useAccount(player).permissions.list();
    messenger.message.send(player, { type: 'warning', content: "Your permissions: " + permissions.toString()});
}
messenger.commands.register({
    name: '/myperms',
    desc: '- list your permissions',
    callback: async (player: alt.Player) => {
        listPermissions(player);
        player.setSyncedMeta("me_msg", "*Ziva Toledo reaches for a weapon");
    },
});
messenger.commands.register({
    name: '/reviveme',
    desc: 'revive',
    options: { permissions: ['admin'] },
    callback: async (player: alt.Player) => {
        player.setSyncedMeta("death_message", "(( Injured ))");
        player.health = 200;
        player.spawn(player.pos);
    },
});
messenger.commands.register({
    name: '/givemeadmin',
    desc: '- gives you admin [DEBUG]',
    callback: async (player: alt.Player) => {
        if (!alt.debug)
        {

            messenger.message.send(player, { type: 'alert', content: "Debug mode not enabled"});
            return;
        }
        const granted = await Rebar.document.account.useAccount(player).permissions.grant('admin');
    if (!granted) {
        messenger.message.send(player, { type: 'alert', content: "Permission was already granted."});
    } else {
        messenger.message.send(player, { type: 'alert', content: "Permission was granted."});
    }
    },
});
init();