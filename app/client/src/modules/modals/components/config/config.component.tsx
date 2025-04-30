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
import { LANGUAGES } from "shared/consts/language.consts";
import i18n from "modules/application/i18n";

export const ConfigComponent: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { setDragPolygon } = useDragContainer();
  const { width, height } = MODAL_SIZE_MAP[Modal.CONFIG];
  const [languageSelected, setLanguageSelected] = useState<string>("es");

  useEffect(() => {
    const language = localStorage.getItem("i18nextLng");
    if (language) {
      setLanguageSelected(language);
    }

    setDragPolygon?.([0, 0, width, 0, width, 15, 0, 15]);
  }, [setDragPolygon, width]);

  const selectLanguage = (key: string) => {
    setLanguageSelected(key);
    localStorage.setItem("i18nextLng", key);
    i18n.changeLanguage(key);
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
          texture="ui-tab-modal"
          leftWidth={14}
          rightWidth={21}
          topHeight={38}
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
            y: 3,
          }}
        >
          <TextComponent
            text={t("config.title")}
            backgroundColor={0xacc1ed}
            backgroundAlpha={1}
            padding={{
              left: 4,
              right: 3,
              bottom: 0,
              top: 2,
            }}
          />
        </FlexContainerComponent>
      </ContainerComponent>

      <ContainerComponent
        position={{
          x: 12,
          y: 38,
        }}
      >
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.CENTER}
          size={{
            width: width - 25,
          }}
          position={{
            x: 0,
            y: 0,
          }}
        >
          <TextComponent
            text={`${t("config.selected_language")}: ${LANGUAGES[languageSelected].label}`}
            color={0}
            position={{
              x: 0,
              y: 10,
            }}
          />
        </FlexContainerComponent>

        <ContainerComponent
          position={{
            x: 0,
            y: 30,
          }}
        >
          {Object.entries(LANGUAGES).reduce((rows, [key, language], index) => {
            
            // Row calculation in order to distribute the buttons 
            // evenly and vertically (in case of more than 3 languages)
            const rowIndex = Math.floor(index / 3);
            if (!rows[rowIndex]) {
              rows[rowIndex] = [];
            }

            rows[rowIndex].push(
              <ButtonComponent
                key={key}
                size={{
                  width: language.label.length * 6,
                  height: 14,
                }}
                text={language.label}
                onPointerDown={() => selectLanguage(key)}
                position={{
                  x: (index % 3) * 45,
                  y: 0,
                }}
              />
            );
            
            return rows;
          }, [] as React.ReactNode[][]).map((row, rowIndex) => (
            <FlexContainerComponent
              key={`row-${rowIndex}`}
              justify={FLEX_JUSTIFY.CENTER}
              gap={10}
              size={{
                width: width - 25,
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
    </>
  );
}; 