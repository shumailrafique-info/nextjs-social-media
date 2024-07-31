"use client";

import { User, Session } from "lucia";
import { createContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

interface Props {
  children: React.ReactNode;
  value: SessionContext;
}

const SessionProvider = ({ children, value }: Props) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export default SessionProvider;
