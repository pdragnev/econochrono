#!/bin/sh

if [ "$INIT_DB" = "true" ]; then
  npx prisma db push
  npm run dataInit
fi

npm run start