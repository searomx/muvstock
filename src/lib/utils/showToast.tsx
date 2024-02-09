'use client';
import React from "react";
import { TypeOptions, toast } from "react-toastify";

export default class ShowToast extends React.PureComponent {
  static showToast(mensagem: string, tipo: TypeOptions | undefined) {
    toast(mensagem, {
      position: 'top-center',
      type: tipo,
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      hideProgressBar: false,
    });

    return toast;
  }
}
