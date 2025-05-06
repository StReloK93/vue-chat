export const scrollToLastMessage = (lastMessageRef: any, smooth: boolean = true) => {
  if (lastMessageRef)
    lastMessageRef.$el.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: "end",
      inline: "nearest",
    });
};
