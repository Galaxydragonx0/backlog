// @ts-nocheck
// Play a CSS "closing" animation on a native <dialog>, then actually close it.
//
// A dialog opened with showModal() lives in the browser's top layer, so calling
// close() removes it instantly with no chance to animate. Instead we add a
// `.closing` class (which the component's CSS animates), wait for that animation
// to end, and only then call close(). The returned promise resolves once the
// dialog has left the top layer, so callers can defer follow-up UI — e.g. a
// toast — until the modal is fully gone.
//
// Falls back to an immediate close if no animation runs (e.g. a breakpoint that
// doesn't define one), so the dialog can never get stuck open.
export function animateClose(dialog) {
  return new Promise((resolve) => {
    if (!dialog || !dialog.open || dialog.classList.contains("closing")) {
      resolve();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(fallback);
      dialog.removeEventListener("animationend", onEnd);
      dialog.classList.remove("closing");
      dialog.close();
      resolve();
    };
    const onEnd = (e) => {
      // React to the dialog's own animation, not the ::backdrop one.
      if (e.target === dialog && !e.pseudoElement) finish();
    };
    dialog.addEventListener("animationend", onEnd);
    // Safety net in case the animation is missing or interrupted.
    const fallback = setTimeout(finish, 400);
    dialog.classList.add("closing");
  });
}
