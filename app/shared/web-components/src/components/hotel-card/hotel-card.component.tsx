import React from "react";

//@ts-ignore
import styles from "./hotel-card.module.scss";
import {
  OfficialIconComponent,
  SignalIconComponent,
  VerifiedIconComponent,
} from "../icons";
import { TooltipComponent } from "../../components/tooltip";
import { ButtonComponent } from "../../components/form";

type Props = {
  official: boolean;
  verified: boolean;
  owner: string;
  title: string;
  description: string;

  logo: string;
  background: string;

  onClickWebsite?: () => void;
  onClickClient: () => void;

  ms?: number;
  users?: number;
  maxUsers?: number;
  joinedUsers: number;
};

export const HotelCardComponent: React.FC<Props> = ({
  official,
  verified,
  owner,
  title,
  description,

  logo,
  background,

  onClickWebsite,
  onClickClient = null,

  ms,
  users,
  maxUsers,
  joinedUsers,
}) => {
  return (
    <div className={styles.hotelWrapper}>
      <div className={styles.hotelCard}>
        <div className={styles.header}>
          <img alt="hotel logo" className={styles.logo} src={logo} />
          <div className={styles.gradient} />
          <img
            alt="hotel background"
            className={styles.background}
            src={background}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.firstLine}>
            <div className={styles.titleWrapper}>
              <TooltipComponent title="Founded on 12 January 2025">
                <label className={styles.title}>{title}</label>
              </TooltipComponent>

              {verified ? (
                <TooltipComponent
                  className={styles.tooltip}
                  title={
                    <>
                      <VerifiedIconComponent className={styles.icon} />
                      <label>Verified server</label>
                    </>
                  }
                >
                  <VerifiedIconComponent className={styles.icon} />
                </TooltipComponent>
              ) : (
                <i>by {owner}</i>
              )}
              {official ? (
                <TooltipComponent
                  className={styles.tooltip}
                  title={
                    <>
                      <OfficialIconComponent className={styles.icon} />
                      <label>Official server</label>
                    </>
                  }
                >
                  <OfficialIconComponent className={styles.icon} />
                </TooltipComponent>
              ) : null}
            </div>
            <div className={styles.status}>
              <div className={styles.users}>
                {maxUsers ? (
                  <TooltipComponent
                    title={`${joinedUsers} users already joined!`}
                  >
                    <label className={styles.current}>
                      {users}/{maxUsers}
                    </label>
                  </TooltipComponent>
                ) : (
                  <label className={styles.joined}>
                    {joinedUsers} already joined
                  </label>
                )}{" "}
              </div>
              <TooltipComponent title={`${ms}ms`}>
                <SignalIconComponent ms={ms} className={styles.icon} />
              </TooltipComponent>
            </div>
          </div>
          <div className={styles.description}>{description}</div>
          <div className={styles.actions}>
            {onClickWebsite ? (
              <ButtonComponent
                color={ms === undefined ? "grey" : "blue"}
                variant="3d"
                onClick={ms === undefined ? null : onClickWebsite}
              >
                Visit website!
              </ButtonComponent>
            ) : null}
            <ButtonComponent
              color={ms === undefined ? "grey" : "yellow"}
              variant="3d"
              onClick={ms === undefined ? null : onClickClient}
            >
              Check in!
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
