import axios from "axios";
import React, { useEffect, useState } from "react";
import { GROUP, ALL_USERS } from "../constants";
import { ChatContext } from "../State/ChatProvider";
import { GlobalContext } from "../State/Provider";

const useAllUsers = () => {
  const { allUsers, setAllUsers } = React.useContext<any>(ChatContext);
  // const { setUserMatchHistory, setLoader } = React.useContext<any>(GlobalContext);

  useEffect(() => {
    // setLoader(true);
    axios
      .get(ALL_USERS)
      .then((res: any) => {
        setAllUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      // .finally(() => setLoader(false));
  }, []);
};

export default useAllUsers;
