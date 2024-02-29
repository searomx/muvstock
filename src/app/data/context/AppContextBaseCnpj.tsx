'use client';
import { createContext, useState } from "react";
const BaseCnpjContexto = createContext({} as any);
export default BaseCnpjContexto;

export function BaseCnpjProvider(props: any) {
  return (
    <BaseCnpjContexto.Provider value={{}}>
      {props.children}
    </BaseCnpjContexto.Provider>

  );
}
