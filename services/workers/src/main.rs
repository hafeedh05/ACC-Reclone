#[tokio::main]
async fn main() -> anyhow::Result<()> {
    workers::run().await
}
