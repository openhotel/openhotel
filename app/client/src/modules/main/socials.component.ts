import {container, Cursor, DisplayObjectEvent, EventMode, sprite, SpriteComponent} from "@tu/tulip";
import {SpriteSheetEnum} from "shared/enums";
import {SOCIALS_LIST} from "shared/consts";

export const socialsComponent: SpriteComponent = () => {
    const $container = container({
        sortableChildren: true,
    });

    const socials = SOCIALS_LIST
    const gap = 10;

    let x = 0;
    for (const social in socials) {
        const {texture, url} = socials[social];
        const $social = sprite({
            spriteSheet: SpriteSheetEnum.BRANDS,
            texture,
            cursor: Cursor.POINTER,
            eventMode: EventMode.STATIC,
            position: {x, y: 0},
            tint: 0xffffff,
        });
        $social.on(DisplayObjectEvent.POINTER_TAP, () => {
            window.open(url, "_blank");
        });
        $container.add($social);
        x += $social.getBounds().width + gap;
    }

    return $container.getComponent(socialsComponent);
};
