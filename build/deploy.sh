#!/usr/bin/env sh

current_dir=$(dirname "$0")
targets="$current_dir/../../WeChatTicketServer/public" #"szp15.cn:/srv/http/wx.szp15.cn"

for target in $targets; do
  rsync -avh "$current_dir/../dist/" --exclude="service-worker.js" $target
  rsync -avh "$current_dir/../dist/service-worker.js" $target
done
