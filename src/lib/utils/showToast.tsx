'use client';
import "../../app/styles.css";
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { TypeOptions, ToastContainer, cssTransition, toast, Bounce } from "react-toastify";

const swirl = cssTransition({
  enter: "swirl-in-fwd",
  exit: "swirl-out-bck"
});
// export default class ShowToast extends React.PureComponent {
//   static showToast(mensagem: string, tipo: TypeOptions | undefined,) {
//     toast(mensagem, {
//       position: 'top-center',
//       type: tipo,
//       autoClose: 3000,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       hideProgressBar: false,
//       progress: undefined,
//     });
//     return toast;
//   }
// }
export default class ShowToast extends React.PureComponent {
  static showToast(mensagem: any, tipo: TypeOptions | undefined,) {
    toast(mensagem, {
      position: 'top-center',
      type: 'success',
      autoClose: 3000,
      transition: swirl
    });
    return toast;
  }
}
