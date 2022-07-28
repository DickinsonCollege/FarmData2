

# Adds launchers to the xfce panel.
# Approach from:
#   https://forum.xfce.org/viewtopic.php?id=8619

# Works if run manually from inside vnc.
# Havent been able to get it to run in any automated way.

mkdir /home/farmdev/.config/xfce4/panel/launcher-50
cp /usr/share/applications/code.desktop ~/.config/xfce4/panel/launcher-50
xfconf-query -c xfce4-panel -p /plugins/plugin-50 -t string -s "launcher" --create
xfconf-query -c xfce4-panel -p /plugins/plugin-50/items -t string -s "code.desktop" -a --create
#xfconf-query -c xfce4-panel -p /panels/panel-2/plugin-ids | grep -v "Value is an\|^$"
xfconf-query -c xfce4-panel -p /panels/panel-2/plugin-ids -rR
xfconf-query -c xfce4-panel -p /panels/panel-2/plugin-ids -t int -s 15 -t int -s 16 -t int -s 17 -t int -s 50 -t int -s 19 -t int -s 18 -t int -s 20 -t int -s 21 -t int -s 22 --create
xfce4-panel -r
