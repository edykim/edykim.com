# Bluetooth Mouse Disconnected

Initial pairing is working fine, however, it doesn't work after rebooting the computer. Also, bluetooth panel shows the mouse as disconnected.

```bash
$ bluetoothctl
# list
# select <ControllerKey>
# show
# power on
# scan on  # it will display a key of target device
# scan off
# agent on
# pair <DeviceKey>
# connect <DeviceKey>
# trust <DeviceKey>
```

- [Bluetooth Mouse Won't Connect after Reboot - Ubuntu 18.04 LTS](https://ubuntuforums.org/showthread.php?t=2390542)
- [Pairing a Bluetooth Device](http://mielke.cc/brltty/doc/Bluetooth.html#for-bluetooth-version-5)

