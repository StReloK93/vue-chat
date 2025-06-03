import type { Message } from "global/helpers";

export const scrollToLastMessage = (elementRef: any, smooth: boolean = true) => {
  if (elementRef)
    elementRef.$el.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: "end",
      inline: "nearest",
    });
};


export function getScrollProcent(event: Event) {
  const element = event.target as HTMLElement;
  const hasScroll = element.scrollHeight > element.clientHeight;
  if (element.scrollTop === 0) return hasScroll ? 0 : 100;
  const percent = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
  return Math.round(percent * 100) / 100
}

export const newMessages = (messages: Message[], myIp: string) => {
  const newMessages = messages.filter(
    (message) => message.from != myIp && !message.viewusers.map((viewedUser) => viewedUser.ipAddress).includes(myIp)
  )
  
  return newMessages.length
}