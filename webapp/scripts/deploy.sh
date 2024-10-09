ssh root@82.165.133.109 << 'EOF'
    echo "Connected!!!"
    eval `ssh-agent -s`
    ssh-add ~/.ssh/id_rsa
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

    if cat /etc/caddy/Caddyfile | grep -q "#reverse_proxy localhost:3000"; then
      app_name="ImmoRadar2"
    else
      app_name="ImmoRadar"
    fi

    cd "/root/node/$app_name/webapp"
    git pull
    yarn build

    if $app_name == "ImmoRadar2"; then
      pm2 restart immoradar-2
    else
      pm2 restart immoradar
    fi

    cd /etc/caddy/
    if $app_name == "ImmoRadar2"; then
      sed -i 's/#reverse_proxy localhost:3000/#reverse_proxy localhost:3000/' /etc/caddy/Caddyfile
      sed -i 's/reverse_proxy localhost:3002/#reverse_proxy localhost:3002/' /etc/caddy/Caddyfile
    else
      sed -i 's/#reverse_proxy localhost:3002/#reverse_proxy localhost:3002/' /etc/caddy/Caddyfile
      sed -i 's/reverse_proxy localhost:3000/#reverse_proxy localhost:3000/' /etc/caddy/Caddyfile
    fi
EOF

    # cd ~/deploy/code
    # git checkout main
    # git pull