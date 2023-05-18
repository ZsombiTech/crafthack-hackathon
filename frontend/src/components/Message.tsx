import React, { FC } from "react";
import { useSelector } from "react-redux";

interface ChatComponentProps {
  isFromUser: boolean;
  message: string | null;
}

const getInitials = (name: string) => {
  const names = name.split(" ");
  let initials = "";
  names.forEach((n) => {
    initials += n[0];
  });
  return initials;
};

const classes = {
  chatContainerRight:
    "p-3 z-30 bg-dark-light rounded-xl text-cream break-words max-w-[60%] md:max-w-[40%] m-10 mt-3 mb-0 mr-12 md:mr-14",
  positionContainerRight: "flex justify-end items-center",
  positionContainerLeft: "flex justify-start items-center",
  positionContainerCol: "flex flex-col",
  alignContainerRight: "flex justify-end",
  chatContainerLeft:
    "p-3 z-30 bg-dark-light rounded-xl text-black break-words max-w-[60%] md:max-w-[40%] m-10 mt-3 mb-0 ml-12 md:ml-14",
  bottomTriangleChatContainerRight:
    "w-8 overflow-hidden inline-block mr-12 md:mr-14 -mt-4",
  bottomTriangleChatRight:
    "h-12 bg-dark-light rounded-xl -rotate-45 transform origin-top-left",
  bottomTriangleChatContainerLeft:
    "w-8 overflow-hidden inline-block ml-12 md:ml-14 -mt-4",
  bottomTriangleChatLeft:
    "h-12 bg-dark-light rounded-xl rotate-45 transform origin-top-right",
  alignWithTriangle: "flex flex-col w-full",
  avatarContainerRight:
    "w-9 h-9 text-xs relative rounded-full bg-primary flex justify-center items-center ml-10 -mt-10",
  avatarContainerLeft:
    "w-9 h-9 relative rounded-full ml-0 md:ml-3 -mt-10 flex justify-center items-center bg-accent bg-no-repeat bg-contain",
  userProfileName: "text-xs text-right mr-16 -mb-2",
  botProfileName: "text-left ml-16 -mb-2",
};

export const ChatComp: FC<ChatComponentProps> = ({ isFromUser, message }) => {
  const currentUserData = useSelector((state: any) => state.userProfile);
  return isFromUser ? (
    <div className="mt-2">
      <div className={classes.alignWithTriangle}>
        <h3 className={classes.userProfileName}>
          {currentUserData && currentUserData.name
            ? currentUserData.name
            : "You"}
        </h3>
        <div className={classes.positionContainerRight}>
          <div className={classes.chatContainerRight}>{message}</div>
        </div>
        <div className={classes.alignContainerRight}>
          <div className={classes.positionContainerCol}>
            <div className={classes.bottomTriangleChatContainerRight}>
              <div className={classes.bottomTriangleChatRight}></div>
            </div>
            <div className={classes.avatarContainerRight}>
              {getInitials(currentUserData ? currentUserData.name : "You")}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="mt-2">
      <div className={classes.alignWithTriangle}>
        <h3 className={classes.botProfileName}>AI Bot</h3>
        <div className={classes.positionContainerLeft}>
          <div className={classes.chatContainerLeft}>{message}</div>
        </div>
        <div className={classes.positionContainerCol}>
          <div className={classes.bottomTriangleChatContainerLeft}>
            <div className={classes.bottomTriangleChatLeft}></div>
          </div>
          <div className={classes.avatarContainerLeft}>AI</div>
        </div>
      </div>
    </div>
  );
};
