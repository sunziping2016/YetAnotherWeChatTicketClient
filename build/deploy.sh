#!/usr/bin/env sh

current_dir=$(dirname "$0")
#target=szp15.cn:/srv/http/szp15.cn
target="$current_dir/../../WeChatTicketServer/public"

rsync -avh "$current_dir/../dist/" --exclude="service-worker.js" $target
rsync -avh "$current_dir/../dist/service-worker.js" $target
