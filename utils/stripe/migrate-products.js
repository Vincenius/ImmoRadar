require('dotenv').config()
const Stripe = require('stripe');

const testStripe = new Stripe(process.env.STRIPE_TEST_KEY);
const liveStripe = new Stripe(process.env.STRIPE_LIVE_KEY);

async function migrate() {
  const products = await testStripe.products.list({ limit: 100 });

  console.log(products)

  for (const product of products.data) {
    // Produkt im Live-Modus erstellen
    const newProduct = await liveStripe.products.create({
      name: product.name,
      description: product.description,
      metadata: product.metadata,
      images: product.images,
      type: product.type
    });

    console.log(`✅ Produkt erstellt: ${newProduct.name}`);

    // Aktive Preise zum Produkt laden
    const prices = await testStripe.prices.list({
      product: product.id,
      active: true,
      limit: 100,
    });

    for (const price of prices.data) {
      const newPrice = await liveStripe.prices.create({
        product: newProduct.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        nickname: price.nickname,
        metadata: price.metadata,
        billing_scheme: price.billing_scheme,
      });

      console.log(`  🔁 Preis erstellt: ${newPrice.unit_amount / 100} ${newPrice.currency}`);
    }
  }

  console.log('\n🎉 Migration abgeschlossen.');
}

migrate().catch((err) => {
  console.error('❌ Fehler bei der Migration:', err);
});
