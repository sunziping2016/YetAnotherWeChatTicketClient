#!/usr/bin/env sh


current_dir=$(dirname "$0")
pushd "$current_dir"
targets="../../WeChatTicketServer/public szp15.cn:/srv/http/wxtickets"

for target in $targets; do
  rsync -avh "../dist/" --exclude="service-worker.js" $target
  rsync -avh "../dist/service-worker.js" $target
done
node emitter newVersion
popd
