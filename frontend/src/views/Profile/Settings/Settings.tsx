import React, { useContext } from "react";
import { AuthContext } from "../../../context/Auth";

const Settings = () => {
  const { user }: any = useContext(AuthContext);

  return (
    <div>
      account settings for {user.username}. maybe something like privacy?
    </div>
  );
};

export default Settings;
