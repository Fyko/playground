use sqlx::postgres::PgPool;
use std::env;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;

    let admin = sqlx::query!(
        "insert into administrator (email, permissions) values ($1, $2) returning id",
        "me@fyko.net",
        0_i64
    )
    .fetch_one(&pool)
    .await?;

    println!("admin: {:#?}", admin);

    Ok(())
}
