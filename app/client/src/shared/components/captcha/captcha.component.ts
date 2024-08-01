import {
  container,
  ContainerComponent,
  ContainerMutable,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  global,
  graphics,
  GraphicType,
  HorizontalAlign,
  sprite,
  textSprite,
} from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";

type CaptchaProps = {
  captchaId: string;
  captchaUrl: string;
  onComplete?: (captchaId: string) => void;
};

type CaptchaPartialMutable = {
  refresh: () => void;
  getCaptchaId: () => string;
};

export type CaptchaMutable = ContainerMutable<
  CaptchaProps,
  CaptchaPartialMutable
>;

export const captchaComponent: ContainerComponent<
  CaptchaProps,
  CaptchaPartialMutable
> = ({ onComplete, ...props }) => {
  const $container = container<CaptchaProps, CaptchaPartialMutable>(props);

  const { captchaId, captchaUrl } = $container.getProps();

  const $captchaContainer = container();
  $container.add($captchaContainer);

  let $captchaId;

  const refresh = async () => {
    $captchaContainer.remove(...$captchaContainer.getChildren());

    const { question, image, sessionId } = await fetch(
      `${captchaUrl}/v1/captcha?id=${captchaId}`,
    ).then((response) => response.json());

    $captchaId = sessionId;

    await global.textures.loadRaw(sessionId, image);
    const $imageSprite = sprite({
      texture: sessionId,
      eventMode: EventMode.STATIC,
      cursor: Cursor.CROSSHAIR,
    });
    const { width, height } = $imageSprite.getBounds();

    const $background = graphics({
      type: GraphicType.RECTANGLE,
      width,
      height,
      tint: 0x333333,
    });
    const $textQuestion = textSprite({
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      text: question,
      withMask: false,
      size: {
        height: 10,
        width: 116,
      },
      position: {
        x: 0,
        y: height + 8,
      },
      horizontalAlign: HorizontalAlign.CENTER,
    });
    $captchaContainer.add($background, $textQuestion, $imageSprite);

    $imageSprite.on(
      DisplayObjectEvent.POINTER_TAP,
      async (data: PointerEvent) => {
        const scale = global.getApplication().getScale();
        const globalPosition = $imageSprite.getGlobalPosition();
        const point = {
          x: Math.trunc(data.x / scale) - globalPosition.x,
          y: Math.trunc(data.y / scale) - globalPosition.y,
        };
        const captchaResponse = await fetch(
          `${captchaUrl}/v1/captcha/response`,
          {
            method: "POST",
            body: JSON.stringify({
              id: captchaId,
              sessionId,
              data: {
                point,
              },
            }),
          },
        ).then((response) => response.json());

        if (captchaResponse !== 200) return refresh();

        $textQuestion.setText("Captcha done!");
        $imageSprite.setVisible(false);
        onComplete?.(sessionId);
      },
    );
  };
  refresh();

  return $container.getComponent(captchaComponent, {
    refresh,
    getCaptchaId: () => $captchaId,
  });
};
