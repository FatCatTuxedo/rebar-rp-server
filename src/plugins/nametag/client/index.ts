import { useRebarClient } from '@Client/index.js';
import { useWebview } from '@Client/webview/index.js';
import { getDirectionFromRotation } from '@Client/utility/math/index.js';
import * as native from 'natives';
import * as alt from 'alt-client';
//import { BagItem } from '@Plugins/inventory/server/index.js';
import { drawText2D } from '@Client/screen/textlabel.js';

const Rebar = useRebarClient();
const webview = Rebar.webview.useWebview();
const messenger = Rebar.messenger.useMessenger();

let lasthealth = alt.Player.local.health;
let PeopleTyping = [];
let labelEmotes = [];
const emoteLabelColor = new alt.RGBA(194, 162, 218, 255);
const descriptionLabelColor = new alt.RGBA(150, 1, 1, 255);
const deathlabelColor = new alt.RGBA(182, 0, 0, 255);
alt.on("syncedMetaChange", async (entity: alt.Entity, key: string, value: any, oldvalue?: any) =>
{
    if (entity instanceof alt.Player)
    {
    if (key == "me_label_desc")
        handleLabelDataChange(entity, value, true);
}
});

function handleLabelDataChange(entity, text, desc, checkForFoot?) {

    let index = labelEmotes.findIndex(labelObject => labelObject.player === entity)
    if (index == -1) {
        var tempDestroyTimer = setTimeout(function () {
            let _index = labelEmotes.findIndex(labelObject => labelObject.player === entity)
            if (_index > -1)
                labelEmotes.splice(_index, 1)
        }, 5000)

        labelEmotes.push({ tick: Date.now(), player: entity, text: text, color: (desc == true ? descriptionLabelColor : emoteLabelColor), destroyTimer: tempDestroyTimer, checkForFoot: checkForFoot })
    }
    else {
        let label = labelEmotes.find(labelObject => labelObject.player === entity)
        label.text = text
        label.color = (desc == true ? descriptionLabelColor : emoteLabelColor)
        label.checkForFoot = checkForFoot
        label.tick = Date.now()

        if (typeof label.destroyTimer !== "undefined") clearTimeout(label.destroyTimer)

        label.destroyTimer = setTimeout(function () {
            let index = labelEmotes.findIndex(labelObject => labelObject.player === entity);
            if (index > -1)
                labelEmotes.splice(index, 1);
        }, 5000)
    }
}


// Draw nametags
alt.everyTick(() => {
    if (lasthealth - alt.Player.local.health >= 5)
    {
        alt.emitServer("healthChange", lasthealth - alt.Player.local.health);
    }
    lasthealth = alt.Player.local.health;
    alt.Utils.drawText2dThisFrame(`Xoa - ~p~Roleplay v0.1~w~ - ${alt.Player.count}/100`, new alt.Vector2(0.5, 0.9675), 0, 0.4, new alt.RGBA(255,255,255, 200), true, false, alt.TextAlign.Center);
    alt.Player.all.forEach(player => {
        if (!player || !player.visible || player.getSyncedMeta("can-select-character")) {
            return;
        }

        const distance = alt.Player.local.pos.distanceTo(player.pos);

        if (distance > 15) {
            return;
        }
        const pos = { ...native.getPedBoneCoords(player.scriptID, 12844, 0, 0, 0) };
        pos.z += 0.33;

        let scale = 1 - (0.8 * distance) / 50;
        let size = scale * 0.42;

        const entity = player.scriptID;
        const vector = native.getEntityVelocity(entity);
        const frameTime = native.getFrameTime();

        const x = pos.x + vector.x * frameTime;
        const y = pos.y + vector.y * frameTime;
        const z = pos.z + vector.z * frameTime;
        const fixName = (cname) => cname.replace('_', ' ');
        let color = player.getStreamSyncedMeta("nametag_c");
        const cname = player.getStreamSyncedMeta("nametag");
        if (!cname) return;
        if (color == "red")
            drawText3D(`[${player.id}] ${fixName(cname)}`, { x, y, z }, size, new alt.RGBA(255,0,0));
        else
            drawText3D(`[${player.id}] ${fixName(cname)}`, { x, y, z }, size, new alt.RGBA(255,255,255));

            if (labelEmotes.findIndex(labelObject => labelObject.player === player) != -1) {

                let labelObject = labelEmotes.find(labelObject => labelObject.player === player);

                if (labelObject != null && labelObject != undefined) {
                    if (Date.now() - labelObject.tick < 5000) {
                        if (!labelObject.checkForFoot || !player.vehicle) {
                            alt.Utils.drawText2dThisFrame(labelObject.text, new alt.Vector2(x, y - 0.025), 0, 0.4, labelObject.color,true, false, alt.TextAlign.Center);
                        }
                    } else {
                        let index = labelEmotes.findIndex(labelObject => labelObject.player === player)
                        if (index > -1)
                            labelEmotes.splice(index, 1)
                    }
                }
            }
    });
});


function drawText3D(text: string, pos: alt.IVector3, scale: number, color: alt.RGBA, offset = alt.Vector2.zero) {
    if (scale > 2) {
        scale = 2;
    }

    native.setDrawOrigin(pos.x, pos.y, pos.z, false);
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.setTextFont(4);
    native.setTextScale(1, scale);
    native.setTextColour(color.r, color.g, color.b, color.a);
    native.setTextOutline();
    native.setTextDropShadow();
    native.setTextJustification(0);
    native.endTextCommandDisplayText(offset.x, offset.y, 0);
    native.clearDrawOrigin();
}
export function drawText2d(
    msg,
    x,
    y,
    scale,
    fontType,
    r,
    g,
    b,
    a,
    useOutline = true,
    useDropShadow = true,
    layer = 0,
    align = 0
) {

    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);
    native.setTextJustification(align);

    if (useOutline) {
        native.setTextOutline();
    }

    if (useDropShadow) {
        native.setTextDropShadow();
    }

    native.endTextCommandDisplayText(x, y, 0);
}