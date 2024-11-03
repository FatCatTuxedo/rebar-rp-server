import * as alt from 'alt-client';
import * as native from 'natives';
alt.loadDefaultIpls();
alt.setStat("shooting_ability", 20);
alt.setStat("strength", 10);
alt.setStat("stamina", 50);
alt.everyTick(() => {
    native.disableControlAction(0, 36, true);
    native.setPedStealthMovement(alt.Player.local, false, "0");
    if (native.isPedArmed(alt.Player.local, 4))
    {
        native.disableControlAction(0, 140, true);
        native.disableControlAction(0, 141, true);
        native.disableControlAction(0, 142, true);
    }
    
    native.disableControlAction(2, 243, true);
});