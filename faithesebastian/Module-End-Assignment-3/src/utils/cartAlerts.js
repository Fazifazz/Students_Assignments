import Swal from "sweetalert2";

const cartToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2400,
  timerProgressBar: true,
});

export function showCartAddedToast(productName) {
  return cartToast.fire({
    icon: "success",
    title: "Added to cart",
    text: productName,
  });
}

export function showCartLimitToast() {
  return cartToast.fire({
    icon: "warning",
    title: "Quantity limit reached",
    text: "You can add up to 10 of each product.",
  });
}
