import Swal from "sweetalert2";

export const Alert = (options) => {
  const {
    title = "Alert",
    text = "Alert text",
    icon = "info",
    confirmButtonText = "Ok",
    ...rest
  } = options;

  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    ...rest,
  });
};

export const ConfirmToast = (options) => {
  const {
    toast = true,
    text = "Toast text",
    icon = "info",
    timer = 3000,
    timerProgressBar = true,
    position = "top-end",
    confirmButtonText = "Yes",
    showConfirmButton = true,
    ...rest
  } = options;

  const Toast = Swal.mixin({
    toast,
    text,
    icon,
    timer,
    timerProgressBar,
    position,
    confirmButtonText,
    showConfirmButton,
    ...rest,
  });

  return Toast.fire({
    ...rest,
  });
};

export const Toast = (options) => {
  const {
    toast = true,
    text = "Toast text",
    icon = "info",
    timer = 3000,
    timerProgressBar = true,
    position = "top-end",
    showConfirmButton = false,
    ...rest
  } = options;

  const Toast = Swal.mixin({
    toast,
    text,
    icon,
    timer,
    timerProgressBar,
    position,
    showConfirmButton,
    ...rest,
  });

  return Toast.fire({
    ...rest,
  });
};
