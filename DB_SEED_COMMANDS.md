# Database Init + Seed Commands (Docker)

Use these commands from the project root:

```bash
docker compose ps
docker compose up -d db

docker compose cp server/init.sql db:/tmp/init.sql
docker compose cp server/prisma/manual-seed.sql db:/tmp/manual-seed.sql

# Reset the DB so init.sql can be applied again
docker compose exec -T db mysql -uroot -prootpassword -e "DROP DATABASE IF EXISTS wealth_holding; CREATE DATABASE wealth_holding;"

# Apply schema
docker compose exec -T db mysql -uwealth_user -pwealth_password wealth_holding -e "source /tmp/init.sql"

# Apply seed data
docker compose exec -T db mysql -uwealth_user -pwealth_password wealth_holding -e "source /tmp/manual-seed.sql"

# Verify seeded rows
docker compose exec -T db mysql -N -B -uwealth_user -pwealth_password wealth_holding -e "SELECT 'Admin', COUNT(*) FROM Admin UNION ALL SELECT 'Project', COUNT(*) FROM Project UNION ALL SELECT 'Job', COUNT(*) FROM Job UNION ALL SELECT 'Post', COUNT(*) FROM Post;"
```

Expected verification output:

```text
Admin    1
Project  3
Job      3
Post     6
```

Notes:

- `init.sql` creates the tables/schema.
- `manual-seed.sql` clears app data tables and inserts sample data.
- The reset step drops and recreates `wealth_holding` to allow re-running schema from scratch.
