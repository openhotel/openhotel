import React from "react";

//@ts-ignore
import styles from "./hotel-card.module.scss";
import {
  OfficialIconComponent,
  SignalIconComponent,
  VerifiedIconComponent,
  NetworkIconComponent,
} from "../icons";
import { TooltipComponent } from "../../components/tooltip";
import { ButtonComponent } from "../../components/form";
import dayjs from "dayjs";
import { cn } from "../../utils";

type Props = {
  official: boolean;
  verified: boolean;
  owner: string;
  title: string;
  description: string;
  createdAt: string;

  logo: string;
  background: string;

  onClickWebsite?: () => void;
  onClickClient: () => void;

  ms?: number;
  users?: number;
  maxUsers?: number;
  version?: string;
  joinedUsers: number;

  onet?: boolean;
};

export const HotelCardComponent: React.FC<Props> = ({
  official,
  verified,
  owner,
  title,
  description,
  createdAt,

  logo,
  background,

  onClickWebsite,
  onClickClient = null,

  ms,
  users,
  maxUsers,
  joinedUsers,
  version,

  onet,
}) => {
  return (
    <div className={styles.hotelWrapper}>
      <div className={styles.hotelCard}>
        <div
          className={cn(styles.header, {
            [styles.notReached]: isNaN(ms),
          })}
        >
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
              <TooltipComponent
                title={`Founded on ${dayjs(createdAt).format("DD MMM YYYY")}`}
              >
                <label className={styles.title}>{title}</label>
              </TooltipComponent>

              {verified ? (
                <TooltipComponent
                  className={styles.tooltip}
                  title={
                    <>
                      <VerifiedIconComponent className={styles.icon} />
                      <label>Verified Server</label>
                    </>
                  }
                >
                  <VerifiedIconComponent className={styles.icon} />
                </TooltipComponent>
              ) : (
                <i>by {owner}</i>
              )}
              {onet ? (
                <TooltipComponent
                  className={styles.tooltip}
                  title={
                    <>
                      <NetworkIconComponent className={styles.icon} />
                      <label>Open Network Protocol</label>
                    </>
                  }
                >
                  <NetworkIconComponent className={styles.icon} />
                </TooltipComponent>
              ) : null}
              {official ? (
                <TooltipComponent
                  className={styles.tooltip}
                  title={
                    <>
                      <OfficialIconComponent className={styles.icon} />
                      <label>Official Server</label>
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
                    title={`${joinedUsers} user/s already joined!`}
                  >
                    <label className={styles.current}>
                      {users}/{maxUsers}
                    </label>
                  </TooltipComponent>
                ) : (
                  <label className={styles.joined}>
                    {joinedUsers} user/s already joined
                  </label>
                )}{" "}
              </div>
              <TooltipComponent
                title={isNaN(ms) ? "Not reachable!" : `${Math.round(ms)}ms`}
              >
                <SignalIconComponent
                  ms={isNaN(ms) ? -1 : ms}
                  className={styles.icon}
                />
              </TooltipComponent>
            </div>
          </div>
          <div className={styles.description}>{description}</div>
          <div className={styles.actions}>
            {onClickWebsite ? (
              <ButtonComponent
                color={isNaN(ms) ? "grey" : "blue"}
                variant="3d"
                onClick={isNaN(ms) ? null : onClickWebsite}
              >
                Visit website!
              </ButtonComponent>
            ) : null}
            <TooltipComponent
              title={
                <>
                  Running on <b>{version ?? "unknown"}</b> version!
                </>
              }
            >
              <ButtonComponent
                color={isNaN(ms) ? "grey" : "yellow"}
                variant="3d"
                onClick={isNaN(ms) ? null : onClickClient}
              >
                Check in!
              </ButtonComponent>
            </TooltipComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
