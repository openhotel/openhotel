import React from "react";
import { MainCardComponent } from "shared/components/main-card.component.tsx";
import { FooterComponent } from "shared/components/footer.component.tsx";
import { ButtonComponent } from "shared/components/button.component.tsx";
import { RadioComponent } from "shared/components/radio.component.tsx";
import { LabelComponent } from "shared/components/label.component.tsx";

export const SetupComponent: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <MainCardComponent />
      <div className="border bg-(--box)">
        <div className="p-card flex gap-6 flex-col">
          <div className=" flex gap-3 flex-col">
            <label className="title">Set up OpenHotel</label>
            <label>
              This server has an empty database and no accounts, so nothing is
              configured yet. Answer a few questions here instead of setting
              environment variables. It takes about five minutes.
            </label>
            <label className="text-(--muted)">
              The server prints a one-time code in its log when it starts empty.
              This keeps strangers from setting up your server first.
            </label>
          </div>
          <label className="sub-title">Choose a mode</label>
          <RadioComponent
            defaultChecked
            title={
              <div className="flex gap-3">
                <span>Managed</span>
                <LabelComponent>Recommended</LabelComponent>
              </div>
            }
            name="mode"
            hint="Joins an existing network such as openhotel.club. You get a licence from the network and guests use their network account."
          />
          <RadioComponent
            title="Standalone"
            name="mode"
            hint="One hotel on its own, with its own accounts. No network, no licence."
          />
          <RadioComponent
            title="Network"
            name="mode"
            hint="You run the network: accounts, hotels, licences and news. Your first hotel is part of it."
          />
          <div className="flex justify-end">
            <ButtonComponent accent>Next</ButtonComponent>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};
