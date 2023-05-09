use sqlx::postgres::PgPool;
use std::env;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pool = PgPool::connect(&env::var("DATABASE_URL")?).await?;

    let admin = sqlx::query!(
        "insert into base_user (email) values ($1) returning id",
        "me@fyko.net"
    )
    .fetch_one(&pool)
    .await?;

    println!("admin: {:#?}", admin);

    Ok(())
}
