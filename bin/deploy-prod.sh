#!/usr/bin/env bash

REPOSITORY=/home/ec2-user/teenybox-frontend

echo "> 배포 시작"

echo "> 프로젝트 폴더로 이동"

cd ${REPOSITORY} || exit 1

echo "> git pull"

git pull origin main || exit 1

echo "> npm 업데이트"

npm install || exit 1

echo "> 빌드 시작"

npm run build || exit 1

echo "> nginx reload"

sudo service nginx reload || exit 1

exit 0
