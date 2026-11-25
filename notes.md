# To Migrate Prisma Schema to Table

npx prisma migrate dev --name something

# To Reset Database / Migrate Fresh

npx prisma migrate reset

# To Generate Prisma Client (after migrate / update prisma schema)

npx prisma generate

# To Generate Next.js Route Types (needed by `tsc` for `LayoutProps`)

npx next typegen

# To Init Dummy / 1st Admin Account

npx auth@latest create-admin --email admin@example.com --name "Admin" --role admin
