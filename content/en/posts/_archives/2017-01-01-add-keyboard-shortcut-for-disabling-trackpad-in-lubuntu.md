---
title: "Add keyboard shortcut for disabling trackpad in Lubuntu"
author: haruair
date: "2017-01-31T15:11:45"
uuid: "486c489b-07bf-47ee-af14-8c8ffe6b75be"
type: post
lang: en
slug: add-keyboard-shortcut-for-disabling-trackpad-in-lubuntu
tags:
  - lubuntu
  - shortcut
private: true
---

I've sold Dell XPS 13 because of a keyboard, I'm back to Dell Inspiron 11 3000.
I bought this machine 8 months ago, Windows 10 was a bit heavy on this laptop.
So I replaced OS as Lubuntu. The laptop is low spec but it's not bad for the
normal terminal work.

The only thing I hate is that this laptop doesn't have a palm rejection. The touchpad
is almost unusable, I think they forgot someone actually can use it as a
pointing device. So I instantly searched how to disable the touchpad when I
want. I found [this solution](http://askubuntu.com/a/160549).

I can see the device on `xinput`, but I cannot temporarily disabled the touchpad
using this script. It turns out, the other weird looking name one is the actual
touchpad. It shows up `DLL0725:01 06CB:7D47` for me.

Also, `xinput disable <id>` makes something weird. When I use this shell script,
the cursor is disappeared. So I changed the script like below:

```bash
#!/bin/bash
# toggle state of synaptics touchpad

# changed SynPS to DLL because of the name
tpid=`xinput list | grep DLL | sed 's/.*id\=\([0-9]\+\).*/\1/g'`

# find out Device Enabled prop from the device
prop=`xinput list-props ${tpid} | grep Device\ Enabled`
propid=`echo ${prop} | sed -e "s/.*(\([0-9]\+\).*/\1/g"`
status=`echo ${prop} | sed -e "s/.*\:[ \t]\+//g"`


if [ 0 -eq ${status} ] ; then
    xinput set-prop ${tpid} ${propid} 1
else
    xinput set-prop ${tpid} ${propid} 0
fi
```

I saved this file as `toggle-touchpad.sh` at the user directory and changed the file
permission. I'm not sure the script is good enough so if you think this script
can be upgraded, please leave a PR to the article.

```bash
chmod +x toggle-touchpad.sh
```

My first thought is that this shell file should execute when Vim change to Insert
mode. So I added `autocmd` config into the vim config file.

```.vimrc
autocmd InsertEnter * silent! execute "!~/toggle-touchpad.sh > /dev/null 2>&1" | redraw!
autocmd InsertLeave * silent! execute "!~/toggle-touchpad.sh > /dev/null 2>&1" | redraw!
```

This event triggered when Vim change to Insert mode. I realized that the insert
mode is a good solution because I couldn't use my mouse when I did Alt-Tab
action during the edit. Therefore, I added another hotkey for this script. I
updated this code into `openbox_config > Keyboard` in
`~/.config/openbox/lubuntu-rc.xml` file. You can change if you want to use other
keybind.

```xml
<keybind key="W-l">
    <action name="Execute">
        <command>~/toggle-touchpad.sh</command>
    </action>
</keybind>
```

Then refresh Openbox for the updating.

```bash
openbox --reconfigure
```

Now, <kbd>Win+L</kbd> will be the key just like a touchpad on/off switch.

This is not a good solution. There are so many options for this type of
configuration, You can achieve the same thing in other ways.
