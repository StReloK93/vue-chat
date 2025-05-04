import os from "os";
export function cleanIp(ip) {
  if (ip.startsWith("::ffff:")) {
    return ip.substring(7);
  }
  return ip;
}

export function getIpAddresses(port) {
  var localeAddress: string[] = [`http://localhost:${port}`];
  const networkInterfaces: any = os.networkInterfaces();
  for (const name of Object.keys(networkInterfaces)) {
    if (networkInterfaces[name]) {
      for (const iface of networkInterfaces[name]) {
        // Пропускаем внутренние (например, 127.0.0.1) и не IPv4
        if (iface.family === "IPv4" && !iface.internal) {
          localeAddress.push(`\nhttp://${iface.address}:${port}`);
        }
      }
    }
  }

  return localeAddress;
}
