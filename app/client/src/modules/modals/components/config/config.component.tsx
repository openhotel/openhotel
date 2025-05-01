import React, { useEffect, useState } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  NineSliceSpriteComponent,
  TilingSpriteComponent,
  useDragContainer,
} from "@openhotel/pixi-components";
import { useTranslation } from "react-i18next";
import { Modal, SpriteSheetEnum } from "shared/enums";
import { ButtonComponent, TextComponent } from "shared/components";
import { useModal } from "shared/hooks";
import { MODAL_SIZE_MAP } from "shared/consts";
import {
  LANGUAGE_PREFERENCE_KEY,
  LANGUAGES,
} from "shared/consts/language.consts";
import i18n from "modules/application/i18n";

export const ConfigComponent: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { setDragPolygon } = useDragContainer();
  const { width, height } = MODAL_SIZE_MAP[Modal.CONFIG];
  const [languageSelected, setLanguageSelected] = useState<string>("en");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  useEffect(() => {
    setDragPolygon?.([0, 0, width, 0, width, 15, 0, 15]);
  }, [setDragPolygon, width]);

  const setSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem("soundEnabled", enabled.toString());
  };

  const setMusic = (enabled: boolean) => {
    setMusicEnabled(enabled);
    localStorage.setItem("musicEnabled", enabled.toString());
  };

  const toggleFullscreen = () => {
    const newState = !fullscreen;
    setFullscreen(newState);
    if (newState) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const savedSound = localStorage.getItem("soundEnabled");
    if (savedSound) {
      setSoundEnabled(savedSound === "true");
    }

    const savedMusic = localStorage.getItem("musicEnabled");
    if (savedMusic) {
      setMusicEnabled(savedMusic === "true");
    }

    const savedLanguage = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
    if (savedLanguage) {
      setLanguageSelected(savedLanguage);
    }
  }, []);

  const selectLanguage = (key: string) => {
    setLanguageSelected(key);
    i18n.changeLanguage(key);
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, key);
  };

  return (
    <>
      <GraphicsComponent
        type={GraphicType.CIRCLE}
        radius={6.5}
        alpha={0}
        cursor={Cursor.POINTER}
        eventMode={EventMode.STATIC}
        position={{
          x: width - 23,
          y: 1.5,
        }}
        onPointerDown={() => closeModal(Modal.CONFIG)}
        zIndex={20}
      />
      <ContainerComponent>
        <NineSliceSpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="ui-base-modal"
          leftWidth={14}
          rightWidth={21}
          topHeight={22}
          bottomHeight={11}
          height={height}
          width={width}
        />
        <TilingSpriteComponent
          texture="ui-tab-modal-bar-tile"
          spriteSheet={SpriteSheetEnum.UI}
          position={{
            x: 11,
            y: 4,
          }}
          width={width - 35}
        />
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.CENTER}
          size={{
            width,
          }}
          position={{
            y: 4,
          }}
        >
          <TextComponent
            text={t("config.title")}
            backgroundColor={0xacc1ed}
            backgroundAlpha={1}
            padding={{
              left: 5,
              right: 5,
              bottom: 0,
              top: 2,
            }}
          />
        </FlexContainerComponent>
      </ContainerComponent>

      <ContainerComponent
        position={{
          x: 10,
          y: 12,
        }}
      >
        {/* Language Settings Section */}
        <ContainerComponent
          position={{
            x: 0,
            y: 10,
          }}
        >
          <TextComponent
            text={t("config.language_settings")}
            color={0x1a1a1a}
            bold
          />
          <TextComponent
            text={`${t("config.selected_language")}: ${LANGUAGES[languageSelected].label}`}
            color={0x999999}
            position={{
              y: 10,
            }}
          />
          <ContainerComponent
            position={{
              y: 20,
            }}
          >
            {Object.entries(LANGUAGES)
              .reduce((rows, [key, language], index) => {
                const rowIndex = Math.floor(index / 4);
                if (!rows[rowIndex]) {
                  rows[rowIndex] = [];
                }

                rows[rowIndex].push(
                  <ButtonComponent
                    key={key}
                    size={{
                      height: 14,
                      width: LANGUAGES[key].label.length * 5 + 3,
                    }}
                    text={language.label}
                    onPointerDown={() => selectLanguage(key)}
                    color={key === languageSelected ? 0 : 0x999999}
                  />,
                );

                return rows;
              }, [] as React.ReactNode[][])
              .map((row, rowIndex) => (
                <FlexContainerComponent
                  key={`row-${rowIndex}`}
                  justify={FLEX_JUSTIFY.CENTER}
                  gap={2}
                  size={{
                    width: width - 40,
                    height: 20,
                  }}
                  position={{
                    y: rowIndex * 20,
                  }}
                >
                  {row}
                </FlexContainerComponent>
              ))}
          </ContainerComponent>
        </ContainerComponent>

        {/* Audio Settings Section */}
        <ContainerComponent
          position={{
            y: 50,
          }}
        >
          <TextComponent
            text={t("config.audio_settings")}
            color={0x1a1a1a}
            bold
          />

          <FlexContainerComponent
            justify={FLEX_JUSTIFY.START}
            gap={4}
            position={{
              y: 15,
            }}
          >
            <ButtonComponent
              size={{
                height: 14,
                width: 35,
              }}
              position={{
                y: -4,
              }}
              text={soundEnabled ? "ON" : "OFF"}
              onPointerDown={() => setSound(!soundEnabled)}
              color={soundEnabled ? 0x1a1a1a : 0x999999}
            />
            <TextComponent text={t("config.sound_effects")} color={0x999999} />
          </FlexContainerComponent>

          <FlexContainerComponent
            justify={FLEX_JUSTIFY.START}
            gap={4}
            position={{
              y: 35,
            }}
          >
            <ButtonComponent
              size={{
                height: 14,
                width: 35,
              }}
              position={{
                y: -4,
              }}
              text={musicEnabled ? "ON" : "OFF"}
              onPointerDown={() => setMusic(!musicEnabled)}
              color={musicEnabled ? 0x1a1a1a : 0x999999}
            />
            <TextComponent text={t("config.music")} color={0x999999} />
          </FlexContainerComponent>
        </ContainerComponent>

        {/* Display Settings Section */}
        <ContainerComponent
          position={{
            y: 100,
          }}
        >
          <TextComponent
            text={t("config.display_settings")}
            color={0x1a1a1a}
            bold
          />

          <FlexContainerComponent
            justify={FLEX_JUSTIFY.START}
            gap={4}
            position={{
              y: 15,
            }}
          >
            <ButtonComponent
              size={{
                height: 14,
                width: 35,
              }}
              position={{
                y: -4,
              }}
              text={fullscreen ? "ON" : "OFF"}
              onPointerDown={toggleFullscreen}
              color={fullscreen ? 0x1a1a1a : 0x999999}
            />
            <TextComponent text={t("config.fullscreen")} color={0x999999} />
          </FlexContainerComponent>
        </ContainerComponent>
      </ContainerComponent>
    </>
  );
};
