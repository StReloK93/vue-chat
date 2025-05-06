const context = new AudioContext();
let buffer: any = null;

fetch("message.mp3")
   .then((res) => res.arrayBuffer())
   .then((data) => context.decodeAudioData(data))
   .then((decoded) => {
      buffer = decoded;
   });

export function playNotificationSound() {
   if (!buffer) return;
   const source = context.createBufferSource();
   source.buffer = buffer;
   source.connect(context.destination);
   source.start(0);
}
