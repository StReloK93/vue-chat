export const scrollToLastMessage = (lastMessageRef: any) => {
  if (lastMessageRef)
    lastMessageRef.$el.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
};
