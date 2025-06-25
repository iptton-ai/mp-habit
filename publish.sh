#!/bin/bash

# 检查是否提供了版本号
tag=$1
if [ -z "$tag" ]; then
  echo "请提供版本号，例如: ./publish.sh v1.1.0"
  exit 1
fi

# 创建标签并推送到远程仓库
git tag "$tag"
git push origin "$tag"

echo "版本 $tag 已成功发布！"
